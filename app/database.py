from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

class User(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_name=db.Column(db.String,unique=True)
    name=db.Column(db.String, nullable=False)
    password=db.Column(db.String)
    email=db.Column(db.String, nullable=False, unique=True)
    role=db.Column(db.String, nullable=False)
    books_borrowed=db.Column(db.Integer)    #Total books borrowed by user to determine if he is  an avid reader
    is_active=db.Column(db.Boolean,nullable=False)
    is_premium=db.Column(db.Boolean) #Make user elegible to download a book
    books=db.relationship("Book",backref="users",secondary="urb")

class Request(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    u_id=db.Column(db.Integer,db.ForeignKey("user.id"))
    b_id=db.Column(db.Integer,db.ForeignKey("book.id"))
    status=db.Column(db.Boolean)

class Urb(db.Model):  # User and Books relationship table
    s_no=db.Column(db.Integer, primary_key=True)
    u_id=db.Column(db.Integer, db.ForeignKey("user.id"))
    b_id=db.Column(db.Integer, db.ForeignKey("book.id"))

class Review(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    u_id=db.Column(db.Integer, db.ForeignKey("user.id"))
    b_id=db.Column(db.Integer, db.ForeignKey("book.id"))
    review=db.Column(db.String, nullable=False)


class Book(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,unique=True,nullable=False)
    description=db.Column(db.String)
    release_date=db.Column(db.Date)
    borrow_count=db.Column(db.Integer)
    hold_count=db.Column(db.Integer)
    upvotes=db.Column(db.Integer)
    genre=db.relationship("Genre",backref="books", secondary="gtb")

class Gtb(db.Model): #Genre and Books relationship table
    s_id=db.Column(db.Integer, primary_key=True)
    b_id=db.Column(db.Integer, db.ForeignKey("book.id"))
    g_id=db.Column(db.Integer, db.ForeignKey("genre.id"))

class Genre(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String,nullable=False, unique=True)
    count=db.Column(db.Integer)
