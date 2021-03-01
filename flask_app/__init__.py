from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(16)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URL"]

db = SQLAlchemy(app)
db.init_app(app)

from .views.auth.sign_up import sign_up_blueprint

app.register_blueprint(sign_up_blueprint)


@app.route('/')
def home():
    return render_template("base.html")
