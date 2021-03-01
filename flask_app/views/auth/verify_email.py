from flask import redirect, flash, Blueprint, request, url_for
from models import User
from flask_app import db
from flask_login import login_required, current_user
import os
import smtplib
from email.mime.text import MIMEText

verify_email_blueprint = Blueprint('verify_email', __name__)


def send_email(to, subject, body):
    msg = MIMEText(body, "html")
    msg['Subject'] = subject
    msg['From'] = os.environ["EMAIL"]
    msg['To'] = to

    server = smtplib.SMTP("smtp.gmail.com:587")
    server.starttls()
    server.login(os.environ["EMAIL"], os.environ["EMAIL_PASSWORD"])
    server.sendmail(os.environ["EMAIL"], to, msg.as_string())
    server.quit()


def send_email_verification_code(user):
    url = request.url_root + url_for("verify_email.verify_email", user_id=user.id, email_code=user.email_code)
    subject = "Your wheaton_class_recommender account email verification code"
    body = "Use this url to verify your email address: {}".format(url)
    return send_email(user, subject, body)


@verify_email_blueprint.route('/verify_email/<user_id>/<email_code>')
def verify_email(user_id, email_code):
    user = User.query.filter_by(id=user_id).first()
    if email_code == user.email_code:
        user.email_verified = True
        db.session.commit()
        flash('Email verified', "success")
    else:
        flash("The url is incorrect, email not verified", "danger")
    return redirect("/")


@verify_email_blueprint.route('/resend_email')
@login_required
def resend_email():
    send_email_verification_code(current_user)
    return redirect("/")
