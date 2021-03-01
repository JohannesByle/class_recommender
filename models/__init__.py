from flask_login import UserMixin
from flask_app import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    email_verified = db.Column(db.Boolean())
    email_code = db.Column(db.String(64))
    password_reset_code = db.Column(db.String(64))
