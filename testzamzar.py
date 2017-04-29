
f
endpoint = "https://sandbox.zamzar.com/v1/jobs"
source_file = '%s' %(os.path.join(application.config['UPLOAD_PATH'], filename))
target_format = "png"

file_content = {'source_file': open(source_file, 'rb')}
data_content = {'target_format': target_format}

initial_res = requests.post(endpoint, data=data_content, files=file_content, auth=HTTPBasicAuth(config.zamzar_key, '')).json()

status = ""
job_id = initial_res.id
status_endpoint = "https://sandbox.zamzar.com/v1/jobs/{}".format(job_id)
while status != "successful":
    time.sleep(1)
    status_res = requests.get(status_endpoint, auth=HTTPBasicAuth(config.zamzar_key, '')).json()
    status == status_res.status
    if status == "successful":
        file_id = status_res.target_files[0].id


download_endpoint = "https://sandbox.zamzar.com/v1/files/{}/content".format(file_id)

response = requests.get(download_endpoint, stream=True, auth=HTTPBasicAuth(config.zamzar_key, ''))

try:
  with open("test_local_filename.png", 'wb') as f:
    for chunk in response.iter_content(chunk_size=1024):
      if chunk:
        f.write(chunk)
        f.flush()

    print("File downloaded")