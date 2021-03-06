from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
from sqlalchemy.exc import OperationalError
from warnings import warn

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(16)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URL"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

login_manager = LoginManager()
login_manager.login_view = 'sign_in.sign_in'
login_manager.init_app(app)

db = SQLAlchemy(app)
from models import *

db.init_app(app)

try:
    from .views.auth.sign_up import sign_up_blueprint
    from .views.auth.sign_in import sign_in_blueprint
    from .views.auth.verify_email import verify_email_blueprint
    from .views.search_classes import search_classes_blueprint
    from .views.upload_transcript import upload_transcript_blueprint

    app.register_blueprint(sign_up_blueprint)
    app.register_blueprint(sign_in_blueprint)
    app.register_blueprint(verify_email_blueprint)
    app.register_blueprint(search_classes_blueprint)
    app.register_blueprint(upload_transcript_blueprint)
except OperationalError or ImportError:
    warn("Database not initialized yet. Ignore this warning if you currently creating the database")


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/')
def home():
    return render_template("base.html")
