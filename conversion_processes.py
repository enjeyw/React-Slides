import requests, os, datetime, time
from requests.auth import HTTPBasicAuth
import cloudconvert

from application import application
import config


def convert_to_image(filename):
    if application.config['CONVERSION_PROCCESS'] == 'cloudconvert':
        time = convert_using_cloudconvert(filename)
    elif application.config['CONVERSION_PROCCESS'] == 'unoconv':
        time = convert_using_unoconv(filename)
    elif application.config['CONVERSION_PROCCESS'] == 'zamzar':
        time = convert_using_zamzar(filename)
    else:
        time = ('')
    return time

def convert_using_zamzar(filename):
    start_time = datetime.datetime.utcnow()

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

    end_time = datetime.datetime.utcnow()

    return(str(end_time-start_time))

def convert_using_cloudconvert(filename):
    start_time = datetime.datetime.utcnow()

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

    end_time = datetime.datetime.utcnow()

    return(str(end_time-start_time))

def convert_using_unoconv(filename):
    start_time = datetime.datetime.utcnow()
    image_type = 'png'

    file_string = filename.rsplit('.', 1)[0]
    current_type = filename.rsplit('.', 1)[1]
    if current_type != 'pdf':
        unoconv_command = "(cd %s && unoconv -f pdf %s)" %(application.config['UPLOAD_PATH'], filename)
        os.system(unoconv_command)

    pdf_time = datetime.datetime.utcnow()
    imagemagick_command = "(cd %s && convert -density 300 %s.pdf -quality 70 %s-%%d.png)" %(application.config['UPLOAD_PATH'], file_string, file_string)
    ghostscript_command = "(cd %s && gs -dNOPAUSE -dBATCH -dNumRenderingThreads=8 -sDEVICE=pngalpha -sOutputFile=%s-%%d.png -r300 -q %s.pdf)" %(application.config['UPLOAD_PATH'], file_string, file_string)
    os.system(ghostscript_command)

    end_time = datetime.datetime.utcnow()

    return (str(end_time - start_time), str(pdf_time - start_time))