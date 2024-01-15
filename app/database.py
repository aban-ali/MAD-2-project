from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_name=db.Column(db.String,unique=True)
    name=db.Column(db.String, nullable=False)
    password=db.Column(db.String)
    email=db.Column(db.String, nullable=False, unique=True)
    role=db.Column(db.String, nullable=False)
    books_borrowed=db.Column(db.Integer)
    is_premium=db.Column(db.Boolean)
    books=db.relationship("Book",backref="users",secondary="urb")

class Urb(db.Model):
    s_no=db.Column(db.Integer, primary_key=True)
    u_id=db.Column(db.Integer, db.ForeignKey("user.id"))
    b_id=db.Column(db.Integer, db.ForeignKey("book.id"))

class Review(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    review=db.Column(db.String, nullable=False)
    rating=db.Column(db.Integer)

class Rtb(db.Model):
    s_no=db.Column(db.Integer, primary_key=True)
    b_id=db.Column(db.Integer, db.ForeignKey("book.id"))
    g_id=db.Column(db.Integer, db.ForeignKey("review.id"))


class Book(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,unique=True,nullable=False)
    description=db.Column(db.String)
    release_date=db.Column(db.Date)
    borrow_count=db.Column(db.Integer)
    hold_count=db.Column(db.Integer)
    genre=db.relationship("Genre",backref="books", secondary="gtb")
    reviews=db.relationship("Review", secondary="rtb")

class Gtb(db.Model):
    s_id=db.Column(db.Integer, primary_key=True)
    b_id=db.Column(db.Integer, db.ForeignKey("book.id"))
    g_id=db.Column(db.Integer, db.ForeignKey("genre.id"))

class Genre(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String,nullable=False, unique=True)
    count=db.Column(db.Integer)
