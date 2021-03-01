from flask import Blueprint, render_template, request, flash, redirect
from werkzeug.security import check_password_hash
from flask_login import login_user, logout_user, login_required
from models import User

sign_in_blueprint = Blueprint("sign_in", __name__)


@sign_in_blueprint.route('/sign_in')
def sign_in():
    return render_template("auth/sign_in_page.html")


@sign_in_blueprint.route('/sign_in', methods=['POST'])
def sign_in_post():
    email = request.form.get('email')
    password = request.form.get('password')
    remember = bool(request.form.get('remember'))

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        flash('Please check your sign_in details and try again.', "danger")
        return redirect("/sign_in")

    login_user(user, remember=remember)
    return redirect("/")


@sign_in_blueprint.route('/sign_out')
@login_required
def sign_out():
    logout_user()
    return redirect("/")
