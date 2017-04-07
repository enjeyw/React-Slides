import os, random, fnmatch, hashlib, base64
from flask import Flask, request, session, redirect, url_for, send_from_directory, render_template, jsonify
import cloudconvert


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = 'static/uploads/'

ALLOWED_EXTENSIONS = set(['ppt', 'pptx','png', 'pdf'])
random_name_length = 20

application = Flask(__name__)
application.config['UPLOAD_FOLDER'] = os.path.join(APP_ROOT, UPLOAD_FOLDER)
application.config['SECRET_KEY'] = 'Smoosh!'
application.config['CONVERSION_PROCCESS'] = 'cloudconvert'

@application.route("/", defaults={'path': ''})
@application.route('/admin/<path>')
def show_index(path):
    return render_template('index.html')

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

            # starting_string = generate_random_name_string(random_name_length)
            starting_string = '1234'
            viewer_id_hash = hash_encode(starting_string, 'viewerhash')[0:4]
            file_hash = viewer_id_hash
            admin_id_hash = viewer_id_hash + hash_encode(viewer_id_hash, 'adminhash')[0:3]

            filename = file_hash + "." + extension
            file.save(os.path.join(application.config['UPLOAD_FOLDER'], filename))
            # convert_to_image(filename)
            id_strings = {'starting_string': starting_string, 'admin_hash': admin_id_hash, 'viewer_hash': viewer_id_hash}
            return jsonify({'message': 'Success', 'id_strings': id_strings}), 200

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
    return send_from_directory(application.config['UPLOAD_FOLDER'],
                               filename)


def generate_random_name_string(length):
    return ''.join(random.choice('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') for i in range(length))

def convert_to_image(filename):
    if application.config['CONVERSION_PROCCESS'] == 'cloudconvert':
        convert_using_cloudconvert(filename)
    elif application.config['CONVERSION_PROCCESS'] == 'cloudconvert':
        convert_using_unoconv(filename)

def convert_using_cloudconvert(filename):
    cc_api = cloudconvert.Api('-oMXETiqmev5qKleFyP9fnN9glF2Off8tMSALvkZ5Z2pZz0Ed7QDOPRmY4BOgLNzB3TqqB-0JRGAlqbGjUMrNQ')

    filetype = filename.rsplit('.', 1)[1]

    print('starting conversion process')

    process = cc_api.convert({
            'inputformat': '%s' %filetype,
            'outputformat': 'png',
            'input': 'upload',
            'save': True,
            'file': open('%s' %(os.path.join(application.config['UPLOAD_FOLDER'], filename)), 'rb')
    })
    process.wait()
    process.downloadAll(application.config['UPLOAD_FOLDER'])

    print('conversion process complete')

def convert_using_unoconv(filename):
    image_type = 'png'

    file_string = filename.rsplit('.', 1)[0]
    unoconv_command = "(cd %s && unoconv -f pdf %s)" %(APP_ROOT, filename)
    os.system(unoconv_command)

    imagemagick_command = "(cd %s && convert -density 150 %s.pdf -quality 100 %s-%%d.png)" %(application.config['UPLOAD_FOLDER'], file_string, file_string)
    os.system(imagemagick_command)

def find_matching_files(id_string):
    files = []

    for file in os.listdir(application.config['UPLOAD_FOLDER']):
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
    application.run(debug=True, threaded=True)
