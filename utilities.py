import random, hashlib, fnmatch, os, base64
from flask import url_for

from application import application


def generate_random_name_string(length):
    return ''.join(random.choice('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') for i in range(length))

def find_matching_files(id_string):
    files = []

    for file in os.listdir(application.config['UPLOAD_PATH']):
        if fnmatch.fnmatch(file, '%s*.png' %(id_string)):
            files.append(url_for('uploaded_file',filename = file))

    return files

def hash_encode(starting_string, final_part):
    return base64.urlsafe_b64encode(
                hashlib.sha1(str(starting_string + application.config['SECRET_KEY'] + final_part).encode('utf-8')).digest()
            ).decode("utf-8").strip('-').strip('_').lower()


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in application.config['ALLOWED_EXTENSIONS']