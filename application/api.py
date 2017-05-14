import os
from flask import request, send_from_directory, render_template, jsonify
from itsdangerous import JSONWebSignatureSerializer


import config

from application import application, utilities, db, models, pusher_client, conversion_processes, email_sender


@application.route("/", defaults={'path': ''})
@application.route('/admin/<path>')
@application.route('/tryit/<path>')
@application.route('/admin/<path>/present')
@application.route("/<path>")
def show_index(path):
    s = JSONWebSignatureSerializer(application.config['SECRET_KEY'])
    websession_token = s.dumps({'session_string': utilities.generate_random_name_string(15)}).decode("utf-8")

    return render_template('index.html', pusher_app_key=config.pusher_key, session_token = websession_token)


@application.route('/emailPreReg', methods=['POST'])
def post_email_PreReg():
    json_data = request.get_json()

    s = JSONWebSignatureSerializer(application.config['SECRET_KEY'])
    websession_string = s.loads(request.authorization['username'].encode("utf-8"))['session_string']


@application.route('/email', methods=['POST'])
def post_email():
    if request.method == 'POST':
        json_data = request.get_json()

        s = JSONWebSignatureSerializer(application.config['SECRET_KEY'])
        websession_string = s.loads(request.authorization['username'].encode("utf-8"))['session_string']

        email = json_data.get('email')

        user = models.Users.query.filter_by(email = email.lower()).first()
        if user is None:
            user = models.Users(email = email.lower())
            db.session.add(user)

        websession = models.Websessions.query.filter_by(websession_string = websession_string).first()
        if websession is None:
            websession = models.Websessions(websession_string = websession_string)
            db.session.add(websession)
            db.session.commit()

        websession.user = user
        db.session.commit()

        email_sender.check_for_email_presentation_pair(websession)

        return jsonify({'message': 'Success'}), 200

@application.route('/demorequest', methods=['POST'])
def request_demo_hash():

    s = JSONWebSignatureSerializer(application.config['SECRET_KEY'])
    websession_string = s.loads(request.authorization['username'].encode("utf-8"))['session_string']

    unique_hash_found = False
    while unique_hash_found == False:
        seed_string = utilities.generate_random_name_string(application.config['SEED_STRING_LENGTH'])
        viewer_id_hash = utilities.hash_encode(seed_string, 'viewerhash')[0:4]
        admin_id_hash = viewer_id_hash + utilities.hash_encode(viewer_id_hash, 'adminhash')[0:3]

        if models.Presentations.query.filter_by(admin_hash = admin_id_hash).first() is None:
            unique_hash_found = True

    presentation = models.Presentations(seed_string = seed_string,
                                        admin_hash = admin_id_hash,
                                        is_demo = True)

    websession = models.Websessions.query.filter_by(websession_string = websession_string).first()
    if websession is None:
        websession = models.Websessions(websession_string = websession_string)
        db.session.add(websession)

    presentation.websessions = websession
    db.session.add(presentation)
    db.session.commit()

    id_strings = {'starting_string': seed_string, 'admin_hash': admin_id_hash, 'viewer_hash': viewer_id_hash}

    return jsonify({'message': 'Success',
                        'id_strings': id_strings,
                        'admin_hash': admin_id_hash,
                        'process_time': ''}), 200

@application.route('/upload', methods=['POST'])
def upload_file():
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
    if file and utilities.allowed_file(file.filename):
        extension = file.filename.rsplit('.', 1)[1]

        unique_hash_found = False
        while unique_hash_found == False:
            seed_string = utilities.generate_random_name_string(application.config['SEED_STRING_LENGTH'])
            viewer_id_hash = utilities.hash_encode(seed_string, 'viewerhash')[0:4]
            file_hash = viewer_id_hash
            admin_id_hash = viewer_id_hash + utilities.hash_encode(viewer_id_hash, 'adminhash')[0:3]

            if models.Presentations.query.filter_by(admin_hash = admin_id_hash).first() is None:
                unique_hash_found = True

        presentation = models.Presentations(seed_string = seed_string,
                                            admin_hash = admin_id_hash)

        websession = models.Websessions.query.filter_by(websession_string = websession_string).first()
        if websession is None:
            websession = models.Websessions(websession_string = websession_string)
            db.session.add(websession)

        presentation.websessions = websession
        db.session.add(presentation)
        db.session.commit()

        filename = file_hash + "." + extension
        file.save(os.path.join(application.config['UPLOAD_PATH'], filename))
        process_time = 'none'
        process_time = conversion_processes.convert_to_image(filename)
        id_strings = {'starting_string': seed_string, 'admin_hash': admin_id_hash, 'viewer_hash': viewer_id_hash}

        email_sender.check_for_email_presentation_pair(websession, provided_presentation=presentation)

        return jsonify({'message': 'Success',
                        'id_strings': id_strings,
                        'admin_hash': admin_id_hash,
                        'process_time': process_time}), 200

@application.route('/images/<viewer_id_hash>', methods = ['GET'])
def get_image_urls(viewer_id_hash):

    viewer_id_hash = viewer_id_hash.lower()

    admin_id_hash = viewer_id_hash + utilities.hash_encode(viewer_id_hash, 'adminhash')[0:3]

    presentation = models.Presentations.query.filter_by(admin_hash = admin_id_hash).first()

    if presentation.is_demo == True:
        viewer_id_hash =  config.demo_presentation_hash

    images = []
    for file in utilities.find_matching_files(viewer_id_hash):
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

@application.route('/switch_slide', methods=['POST'])
def switch_slide():
    json_data = request.get_json()
    channel = json_data['channel']
    slide_index = json_data['slide_index']
    if channel == channel[0:4] + utilities.hash_encode(channel[0:4], 'adminhash')[0:3]:
        pusher_client.trigger(channel[0:4], 'slide_index', {'slide_index': slide_index})
        return jsonify({'message': 'Success'}), 200
    else:
        return jsonify({'message': 'Forbidden'}), 403
