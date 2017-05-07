import os, base64, time, datetime
from flask import Flask, request, session, redirect, url_for, send_from_directory, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy

from itsdangerous import JSONWebSignatureSerializer
import pusher

import logging

from logging.handlers import RotatingFileHandler

import config


application = Flask(__name__)
application.config.from_object('config')

db = SQLAlchemy(application)

from models import User, Websession, Presentation

from db_create import create_database
from conversion_processes import convert_to_image
from utilities import generate_random_name_string, find_matching_files, hash_encode, allowed_file

pusher_client = pusher.Pusher(
  app_id=config.pusher_app_id,
  key=config.pusher_key,
  secret=config.pusher_secret,
  cluster='ap1',
  ssl=True
)

@application.route("/", defaults={'path': ''})
@application.route('/admin/<path>')
@application.route('/admin/<path>/present')
@application.route("/<path>")
def show_index(path):
    s = JSONWebSignatureSerializer(application.config['SECRET_KEY'])
    websession_token = s.dumps({'session_string': generate_random_name_string(15)}).decode("utf-8")

    return render_template('index.html', pusher_app_key=config.pusher_key, session_token = websession_token)

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

@application.route('/email', methods=['POST'])
def post_email():
    if request.method == 'POST':
        json_data = request.get_json()

        s = JSONWebSignatureSerializer(application.config['SECRET_KEY'])
        websession_string = s.loads(request.authorization['username'].encode("utf-8"))['session_string']

        email = json_data.get('email')

        # user = models.User.query.filter_by(email = email).first()
        # if user is None:
        user = User(email = email)
        db.session.add(user)


        websession = Websession.query.filter_by(websession_string = websession_string).first()
        if websession is None:
            websession = Websession(websession_string = websession_string)
            db.session.add(websession)

        websession.user = user

        db.session.commit()

        return jsonify({'message': 'Success'}), 200

@application.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'message': 'No File'}), 400
        file = request.files['file']

        s = JSONWebSignatureSerializer(application.config['SECRET_KEY'])
        websession_string = s.loads(request.authorization['username'].encode("utf-8"))['session_string']

        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            return jsonify({'message': 'No File'}), 400
        if file and allowed_file(file.filename):
            extension = file.filename.rsplit('.', 1)[1]

            unique_hash_found = False
            while unique_hash_found == False:
                seed_string = generate_random_name_string(application.config['SEED_STRING_LENGTH'])
                viewer_id_hash = hash_encode(seed_string, 'viewerhash')[0:4]
                file_hash = viewer_id_hash
                admin_id_hash = viewer_id_hash + hash_encode(viewer_id_hash, 'adminhash')[0:3]

                if Presentation.query.filter_by(viewer_id_hash = viewer_id_hash).first() is None:
                    unique_hash_found = True

            presentation = Presentation(seed_string = seed_string,
                                               viewer_id_hash = viewer_id_hash)

            websession = Websession.query.filter_by(websession_string = websession_string).first()
            if websession is None:
                websession = Websession(websession_string = websession_string)
                db.session.add(websession)
                db.session.commit()

            presentation.websession = websession
            db.session.add(presentation)
            db.session.commit()


            filename = file_hash + "." + extension
            file.save(os.path.join(application.config['UPLOAD_PATH'], filename))
            process_time = 'none'
            # process_time = convert_to_image(filename)
            id_strings = {'starting_string': seed_string, 'admin_hash': admin_id_hash, 'viewer_hash': viewer_id_hash}


            return jsonify({'message': 'Success',
                            'id_strings': id_strings,
                            'admin_hash': admin_id_hash,
                            'process_time': process_time}), 200

@application.route('/images/<id_hash>', methods = ['GET'])
def get_image_urls(id_hash):

    images = []
    for file in find_matching_files(id_hash):
        try:
            image_id = file.rsplit('.', 1)[0].rsplit('-', 1)[1]
        except IndexError:
            image_id = 1
        images.append((image_id,file))

    images_sorted = sorted(images, key = lambda x: int(x[0]))

    return jsonify({'message': 'Success', 'images': images_sorted}), 200

@application.route('/uploads/<filename>')
def uploaded_file(filename):
    if  '.' in filename and filename.rsplit('.', 1)[1] == 'png':
        return send_from_directory(application.config['UPLOAD_PATH'],
                               filename)
    else:
        return jsonify({'message': 'File type not allowed'}), 403



if __name__ == "__main__":
    handler = RotatingFileHandler('/var/app/pythonerrors.log', maxBytes=10000, backupCount=1)
    handler.setLevel(logging.INFO)
    application.logger.addHandler(handler)

    if not os.path.exists(application.config['UPLOAD_PATH']):
        os.makedirs(application.config['UPLOAD_PATH'])

    create_database()

    # application.run(host='0.0.0.0', threaded=True, debug=True)
    application.run(port=5001, threaded=True, debug=True)

