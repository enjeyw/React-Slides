from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import pusher

import config

application = Flask(__name__)
application.config.from_object('config')
db = SQLAlchemy(application)

pusher_client = pusher.Pusher(
  app_id=config.pusher_app_id,
  key=config.pusher_key,
  secret=config.pusher_secret,
  cluster='ap1',
  ssl=True
)

from application import api, models, utilities, conversion_processes, email_sender

