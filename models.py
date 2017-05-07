from application import db
import datetime
from flask_sqlalchemy import SQLAlchemy


class User(db.Model):
    __tablename__ = 'user'

    id                  = db.Column(db.Integer, primary_key=True)
    date_created        = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    email               = db.Column(db.String(120), index=True, unique=True)
    is_pro              = db.Column(db.Boolean, default=False)

    presentations       = db.relationship('Presentation', backref='user', lazy='dynamic')
    websessions            = db.relationship('Websession', backref='user', lazy='dynamic')

class Presentation(db.Model):
    __tablename__ = 'presentation'

    id                  = db.Column(db.Integer, primary_key=True)
    date_created        = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    seed_string         = db.Column(db.String(120), unique=True)
    viewer_id_hash      = db.Column(db.String(120), unique=True)

    expire_date         = db.Column(db.DateTime, default=datetime.datetime.utcnow() + datetime.timedelta(days = 7))

    user_id             = db.Column(db.Integer, db.ForeignKey('user.id'))
    websession_id          = db.Column(db.Integer, db.ForeignKey('websession.id'))



class Websession(db.Model):
    __tablename__ = 'websession'

    id                  = db.Column(db.Integer, primary_key=True)
    date_created        = db.Column(db.DateTime, default=datetime.datetime.utcnow())

    websession_string      = db.Column(db.String(120), unique=True)

    presentations       = db.relationship('Presentation', backref='websession', lazy='dynamic')
    user_id             = db.Column(db.Integer, db.ForeignKey('user.id'))


