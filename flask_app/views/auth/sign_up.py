from . import create_code
from flask import render_template, request, redirect, flash, Blueprint
from models import User
from flask_app import db
from werkzeug.security import generate_password_hash
from .verify_email import send_email_verification_code

sign_up_blueprint = Blueprint("sign_up", __name__)


@sign_up_blueprint.route('/sign_up')
def sign_up():
    return render_template("auth/sign_up_page.html")


@sign_up_blueprint.route('/sign_up', methods=['POST'])
def sign_up_post():
    email = request.form.get('email')
    password = request.form.get('password')
    user = User.query.filter_by(email=email).first()
    if user:
        flash('Email address already exists', "danger")
        return redirect("/sign_up")
    new_user = User(
        email=email,
        password=generate_password_hash(password, method='sha256'),
        email_code=create_code(),
        email_verified=False,
        classes=[]
    )
    db.session.add(new_user)
    db.session.commit()
    # send_email_verification_code(new_user)
    return redirect("/sign_in")
