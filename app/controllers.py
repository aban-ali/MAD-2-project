from flask import request, render_template, redirect, url_for, send_from_directory, jsonify
from flask import current_app as app
from .database import *
from .graphql import *


@app.route('/')
def login_register():
    return render_template('index.html')

@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()

    success, result = graphql_sync(
        schema,
        data
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

@app.route("/login", methods=["POST"])
def login():
    pass

@app.route("/register", methods=["POST"])
def register():
    name=request.form["name"]
    email=request.form["email"]
    username=request.form["username"]
    password=request.form["pass"]
    role=request.form["btnradio"]
    print(name,email,username,password,role)
    return render_template("index.html")