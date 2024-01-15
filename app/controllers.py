from flask import request, render_template, redirect, url_for, send_from_directory, jsonify
from flask import current_app as app
from flask_jwt_extended import JWTManager, create_access_token
from .database import *
from .graphql import *

jwt=JWTManager()

@app.route('/')
def login_register(msg=""):
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

@app.get("/token/<user_id>")
def token(user_id):
    user=User.query.filter_by(id=user_id).first()
    if user:
        token=create_access_token(user)
        return jsonify({"token":token}),200
    return jsonify("Enter correct Details")

@app.route("/dashboard",methods=["GET","POST"])
def dashboard():
    return render_template("user_dashboard.html")

@app.route("/register", methods=["POST"])
def register():
    name=request.form["name"]
    email=request.form["email"]
    username=request.form["username"]
    password=request.form["pass"]
    role=request.form["btnradio"]
    new_user=User(user_name=username,name=name, password=password,email=email,role=role, books_borrowed=0, is_premium=False)
    db.session.add(new_user)
    db.session.commit()
    return redirect(url_for("login_register"))

@app.route('/admin-login')
def admin_login():
    return render_template("admin_login.html")


#-------------------FLASK-JWT-EXTENDED CONFIGURATION-------------------------------------
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()