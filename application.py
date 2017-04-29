import os, random, fnmatch, hashlib, base64, time
from flask import Flask, request, session, redirect, url_for, send_from_directory, render_template, jsonify
import cloudconvert
import pusher
import requests
from requests.auth import HTTPBasicAuth

import config

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
# UPLOAD_FOLDER = 'static/uploads/'
# UPLOAD_PATH = os.path.join(APP_ROOT, UPLOAD_FOLDER)

UPLOAD_PATH = '/var/app/'

ALLOWED_EXTENSIONS = set(['ppt', 'pptx','png', 'pdf'])
random_name_length = 20

application = Flask(__name__)
application.config['UPLOAD_PATH'] = UPLOAD_PATH
application.config['SECRET_KEY'] = config.SECRET_KEY
application.config['CONVERSION_PROCCESS'] = 'cloudconvert'

pusher_client = pusher.Pusher(
  app_id=config.pusher_app_id,
  key=config.pusher_key,
  secret=config.pusher_secret,
  cluster='ap1',
  ssl=True
)

@application.route("/", defaults={'path': ''})
@application.route('/admin/<path>')
@application.route("/<path>")
def show_index(path):
    return render_template('index.html', pusher_app_key=config.pusher_key)

@application.route('/switch_slide', methods=['POST'])
def switch_slide():
    json_data = request.get_json()
    channel = json_data['channel']
    slide_index = json_data['slide_index']
    if channel == channel[0:4] + hash_encode(channel[0:4], 'adminhash')[0:3]:
        pusher_client.trigger(channel[0:4], 'slide_index', {'slide_index': slide_index})
        return jsonify({'message': 'Success'}), 200
    else:
        return jsonify({'message': 'Forbidden'}), 403


@application.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'message': 'No File'}), 400
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            return jsonify({'message': 'No File'}), 400
        if file and allowed_file(file.filename):
            extension = file.filename.rsplit('.', 1)[1]

            starting_string = generate_random_name_string(random_name_length)
            # starting_string = '1234'
            viewer_id_hash = hash_encode(starting_string, 'viewerhash')[0:4]
            file_hash = viewer_id_hash
            admin_id_hash = viewer_id_hash + hash_encode(viewer_id_hash, 'adminhash')[0:3]

            filename = file_hash + "." + extension
            file.save(os.path.join(application.config['UPLOAD_PATH'], filename))
            convert_to_image(filename)
            id_strings = {'starting_string': starting_string, 'admin_hash': admin_id_hash, 'viewer_hash': viewer_id_hash}
            return jsonify({'message': 'Success', 'id_strings': id_strings, 'admin_hash': admin_id_hash}), 200

@application.route('/images/<id_hash>', methods = ['GET'])
def get_image_urls(id_hash):

    files = sorted(find_matching_files(id_hash))
    images = []
    for file in files:
        image_id = file.rsplit('.', 1)[0].rsplit('-', 1)[1]
        images.append((image_id,file))

    return jsonify({'message': 'Success', 'images': images}), 200

@application.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(application.config['UPLOAD_PATH'],
                               filename)


def generate_random_name_string(length):
    return ''.join(random.choice('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') for i in range(length))

def convert_to_image(filename):
    if application.config['CONVERSION_PROCCESS'] == 'cloudconvert':
        convert_using_cloudconvert(filename)
    elif application.config['CONVERSION_PROCCESS'] == 'unoconv':
        convert_using_unoconv(filename)
    elif application.config['CONVERSION_PROCCESS'] == 'zamzar':
        convert_using_zamzar(filename)

def convert_using_zamzar(filename):

    file_string = filename.rsplit('.', 1)[0]

    endpoint = "https://sandbox.zamzar.com/v1/jobs"
    source_file = '%s' %(os.path.join(application.config['UPLOAD_PATH'], filename))
    target_format = "png"

    file_content = {'source_file': open(source_file, 'rb')}
    data_content = {'target_format': target_format}

    initial_res = requests.post(endpoint, data=data_content, files=file_content, auth=HTTPBasicAuth(config.zamzar_key, '')).json()

    status = ""
    job_id = initial_res['id']
    status_endpoint = "https://sandbox.zamzar.com/v1/jobs/{}".format(job_id)
    while status != "successful":
        time.sleep(1)
        status_res = requests.get(status_endpoint, auth=HTTPBasicAuth(config.zamzar_key, '')).json()
        status = status_res['status']
        if status == "successful":
            target_files = status_res['target_files']

    for index, file in enumerate(target_files):
        file_id = file['id']
        download_endpoint = "https://sandbox.zamzar.com/v1/files/{}/content".format(file_id)

        download_response = requests.get(download_endpoint, stream=True, auth=HTTPBasicAuth(config.zamzar_key, ''))
        #
        # try:
        #   with open('%s-%s.png' %(os.path.join(application.config['UPLOAD_PATH'], file_string), index + 1), 'wb') as f:
        #     for chunk in download_response.iter_content(chunk_size=1024):
        #       if chunk:
        #         f.write(chunk)
        #         f.flush()
        #
        #     print("File downloaded")
        #
        # except IOError:
        #     print("Error")

def convert_using_cloudconvert(filename):
    cc_api = cloudconvert.Api(config.cloudconvert_key)

    filetype = filename.rsplit('.', 1)[1]

    print('starting conversion process')

    process = cc_api.convert({
            'inputformat': '%s' %filetype,
            'outputformat': 'png',
            'input': 'upload',
            'save': True,
            'file': open('%s' %(os.path.join(application.config['UPLOAD_PATH'], filename)), 'rb')
    })
    process.wait()
    process.downloadAll(application.config['UPLOAD_PATH'])

    print('conversion process complete')



def convert_using_unoconv(filename):
    image_type = 'png'

    file_string = filename.rsplit('.', 1)[0]
    current_type = filename.rsplit('.', 1)[1]
    if current_type != 'pdf':
        unoconv_command = "(cd %s && unoconv -f pdf %s)" %(UPLOAD_PATH, filename)
        os.system(unoconv_command)

    imagemagick_command = "(cd %s && convert -density 150 %s.pdf -quality 100 %s-%%d.png)" %(application.config['UPLOAD_PATH'], file_string, file_string)
    os.system(imagemagick_command)

def find_matching_files(id_string):
    files = []

    for file in os.listdir(application.config['UPLOAD_PATH']):
        if fnmatch.fnmatch(file, '%s-*.png' %(id_string)):
            files.append(url_for('uploaded_file',filename = file))

    return files

def hash_encode(starting_string, final_part):
    return base64.urlsafe_b64encode(
                hashlib.sha1(str(starting_string + application.config['SECRET_KEY'] + final_part).encode('utf-8')).digest()
            ).decode("utf-8").strip('-').strip('_')


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

if __name__ == "__main__":

    application.run(host='0.0.0.0', threaded=True, debug=True)
    # application.run(port=5001, threaded=True, debug=True)

