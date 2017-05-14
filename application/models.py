from application import db

import datetime

def future_datetime():

    timedelta = 7

    return datetime.datetime.utcnow() + datetime.timedelta(days = timedelta)

class Users(db.Model):
    __tablename__ = 'users'

    id                  = db.Column(db.Integer, primary_key=True)
    date_created        = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    email               = db.Column(db.String(120), index=True, unique=True)
    ref_key             = db.Column(db.String(120), index=True, unique=True)
    is_pro              = db.Column(db.Boolean, default=False)

    presentations       = db.relationship('Presentations', backref='user', lazy='dynamic')
    websessions            = db.relationship('Websessions', backref='user', lazy='dynamic')

class Presentations(db.Model):
    __tablename__ = 'presentations'

    id                  = db.Column(db.Integer, primary_key=True)
    date_created        = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    seed_string         = db.Column(db.String(120), unique=True)
    admin_hash          = db.Column(db.String(120), unique=True)

    is_demo             = db.Column(db.Boolean, default=False)
    expire_date         = db.Column(db.DateTime, default=future_datetime)

    user_id             = db.Column(db.Integer, db.ForeignKey('users.id'))
    websession_id       = db.Column(db.Integer, db.ForeignKey('websessions.id'))

class Websessions(db.Model):
    __tablename__ = 'websessions'

    id                  = db.Column(db.Integer, primary_key=True)
    date_created        = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    websession_string   = db.Column(db.String(120), unique=True)
    ref_query_string    = db.Column(db.String(120), unique=True)

    presentations       = db.relationship('Presentations', backref='websessions', lazy='dynamic')
    user_id             = db.Column(db.Integer, db.ForeignKey('users.id'))


