import requests
from flask import render_template
import config


def check_for_email_presentation_pair(websession, provided_presentation = None):

    if (len(websession.presentations.all()) > 0 ) and (websession.user is not None):
        if provided_presentation == None:
            for presentation in websession.presentations.all():
                response = send_admin_details(websession.user.email, presentation.admin_hash)
        else:
            response = send_admin_details(websession.user.email, provided_presentation.admin_hash)

def send_admin_details(recipient_email, admin_hash):

    admin_details_email = requests.post(
        config.mailgun_api_endpoint,
        auth=("api", config.mailgun_auth_key),
        data={"from": config.mailgun_sender,
              "to": recipient_email,
              "subject": "Slidecast: Your Administration Link",
              "text": render_template("admin_details.txt", admin_hash = admin_hash) })

    return admin_details_email

