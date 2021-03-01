from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(16)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URL"]

db = SQLAlchemy(app)
db.init_app(app)

from .views.auth.sign_up import sign_up_blueprint
from .views.auth.sign_in import sign_in_blueprint
from models import User

app.register_blueprint(sign_up_blueprint)
app.register_blueprint(sign_in_blueprint)

login_manager = LoginManager()
login_manager.login_view = 'sign_in.sign_in'
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/')
def home():
    return render_template("base.html")
