#!flask/bin/python
import logging, os, db_create, shutil
from logging.handlers import RotatingFileHandler
from application import application, conversion_processes, utilities, models, db
import config

handler = RotatingFileHandler('/var/app/pythonerrors.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.INFO)
application.logger.addHandler(handler)

if not os.path.exists(application.config['UPLOAD_PATH']):
    os.makedirs(application.config['UPLOAD_PATH'])

db_create.create_database()


shutil.copy2(config.demo_presentation_hash + '.pdf', application.config['UPLOAD_PATH'])
conversion_processes.convert_to_image(config.demo_presentation_hash + '.pdf')
admin_id_hash = config.demo_presentation_hash + utilities.hash_encode(config.demo_presentation_hash, 'adminhash')[0:3]
if models.Presentations.query.filter_by(admin_hash = admin_id_hash).first() is None:
        presentation = models.Presentations(admin_hash = admin_id_hash)
        db.session.add(presentation)
        db.session.commit()

application.run(host='0.0.0.0', threaded=True, debug=True)
# application.run(port=5001, threaded=True, debug=True)

