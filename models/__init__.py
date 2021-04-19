from flask_login import UserMixin
from flask_app import db
import json
import os

with open(os.path.join(os.path.dirname(__file__), "tags.json"), "r") as f:
    tags = json.load(f)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    email_verified = db.Column(db.Boolean())
    email_code = db.Column(db.String(64))
    password_reset_code = db.Column(db.String(64))
    classes = db.Column(db.JSON)


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String(15))
    crn = db.Column(db.Integer)
    subj = db.Column(db.String(4))
    crse = db.Column(db.String(5))
    sec = db.Column(db.String(3))
    cmp = db.Column(db.String(2))
    cred = db.Column(db.String(15))
    title = db.Column(db.String(100))
    days = db.Column(db.String(7))
    time = db.Column(db.String(25))
    cap = db.Column(db.Integer)
    act = db.Column(db.Integer)
    rem = db.Column(db.Integer)
    wl_cap = db.Column(db.Integer)
    wl_act = db.Column(db.Integer)
    wl_rem = db.Column(db.Integer)
    xl_cap = db.Column(db.Integer)
    xl_act = db.Column(db.Integer)
    xl_rem = db.Column(db.Integer)
    instructor = db.Column(db.String(500))
    date = db.Column(db.String(15))
    location = db.Column(db.String(25))
    attribute = db.Column(db.String(200))
    desc = db.Column(db.String(500))
    prereqs = db.Column(db.JSON)
    coreqs = db.Column(db.JSON)


