from flask import Flask
from flask import request, render_template, redirect, url_for, send_from_directory
from app.database import db
from app.config import Development

def createApp():
    app=Flask(__name__)
    app.config.from_object(Development)
    db.init_app(app)
    with app.app_context():
        db.create_all()
    return app

app=createApp()
app.app_context().push()

from app.controllers import *

jwt.init_app(app)

if __name__=="__main__":
    app.run(debug=True)