from flask import request, render_template, redirect, url_for, send_from_directory, jsonify
from flask import current_app as app,send_from_directory
from datetime import date
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, current_user
from .database import *
from .graphql import *
import json

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
        user.is_active=True
        db.session.commit()
        token=create_access_token(identity=user)
        return jsonify({"token":token}),200
    return jsonify("Enter correct Details")

@app.route("/dashboard",methods=["GET","POST"])
def dashboard():
    return render_template("user_dashboard.html")

@app.route("/error_page")
def error_page():
    return render_template("error.html")

@app.route('/validate', methods=["POST"])
@jwt_required()
def validate():
    try:
        return jsonify({"active_status":current_user.is_active,"role":current_user.role,"username":current_user.user_name})
    except:
        return jsonify({"active_status":False})

@app.route('/logout', methods=["POST"])
@jwt_required()
def logout():
    try:
        current_user.is_active=False
        db.session.commit()
        return jsonify({"is_active":current_user.is_active})
    except:
        return jsonify({"is_active":current_user.is_active})

@app.route("/register", methods=["POST"])
def register():
    name=request.form["name"]
    email=request.form["email"]
    username=request.form["username"]
    password=request.form["pass"]
    role=request.form["btnradio"]
    new_user=User(user_name=username,name=name, password=password,email=email,role=role, books_borrowed=0, is_premium=False, is_active=False)
    db.session.add(new_user)
    db.session.commit()
    return redirect(url_for("login_register"))

@app.route('/admin', methods=["GET","POST"])
def admin_login():
    if request.method=="POST":
        username=request.form["username"]
        password=request.form["pass"]
        try:
            name=request.form["name"]
            email=request.form["email"]
            role="Admin"
            admin=User(user_name=username,name=name,password=password,email=email,role=role,books_borrowed=0,is_active=False,is_premium=True)
            db.session.add(admin)
            db.session.commit()
        except:
            user=User.query.filter_by(user_name=username,role="Admin").first()
            if user and password==user.password:
                return redirect(url_for("admin_dashboard"))
            return render_template("error.html")
    return render_template("admin_login.html")


@app.route('/admin-dashboard')
def admin_dashboard():
    return render_template("admin_dashboard.html")

@app.route('/add_book', methods=["POST"])
def add_book():
    try:
        name=request.form["book_name"]
        book=Book.query.filter_by(name=name).first()
        book_pdf=request.files["book_file"]
        book_pdf.save(join("uploads",(str(book.id) + ".pdf")))
    finally:
        return redirect(url_for("admin_dashboard"))

@app.route('/pdf/<filename>')
def get_pdf(filename):
    return send_from_directory("uploads", filename)

@app.route("/<user>/books")
def admin_books_page(user):
    return render_template("list_books.html")

@app.route("/admin/users")
def admin_users_page():
    return render_template("admin_users.html")

@app.route("/book/<book_name>")
def book(book_name):
    data={"book_name":book_name}
    return render_template("book.html",data=json.dumps(data))

@app.get("/image/<file>")
def get_image(file):
    return send_from_directory('static/images',file+".jpg")

#-------------------FLASK-JWT-EXTENDED CONFIGURATION-------------------------------------
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).first()