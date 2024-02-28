from ariadne import ObjectType, gql, make_executable_schema,graphql_sync,ScalarType
from .database import db,User,Genre,Urb,Review,Book,Gtb,Request
from datetime import date, timedelta
from os.path import join,exists
from os import remove

type_defs = """
    scalar Date
    type Query {
        user(
            user_name: String
            name: String
            role: String
            email: String
        ):[User]!
        genres:[Genre]!
        book(
            name:String
        ):[Books]
        request(
            u_id:Int
            b_id:Int
        ):[Request]
    }
    type User {
        id:Int
        user_name:String
        name:String
        role:String
        email:String
        password:String
        is_active:Boolean
        books_borrowed:Int
        is_premium:Boolean
        books:[Books]
        requests:[Request]
    }
    type Request{
        id:Int
        status:Boolean
        deadline:Date
        book:Books
        user:User
    }
    type Genre{
        id:Int
        name:String
        count:Int
    }
    type Books{
        id:Int
        name:String
        description:String
        release_date:Date
        borrow_count:Int
        hold_count:Int
        users:[User]
        genre:[Genre]
        reviews:[Reviews]
    }
    type Reviews{
        review:String
        user:User
    }
    type Mutation{
        genre(name:String!):Boolean!
        del_genre(name:String!):Boolean!
        book(
            name:String!
            genre:[String]
            description:String
            ):Boolean!
        user(
            user_name:String!
            is_premium:Boolean
        ):Boolean!
        edit_book(
            id:String!
            name:String
            genre:[String]
            description:String
            ):Boolean!
        delete_book(name:String!):Boolean!
        delete_user(username:String!):Boolean!
        add_review(
            u_id:Int!
            b_id:Int!
            review:String!
            ):Boolean!
        request(
            u_id:Int!
            b_id:Int!
            status:Boolean
            ):Boolean!
        revoke(
            u_id:Int!
            b_id:Int!
        ):Boolean!
    }
"""
book_type=ObjectType("Books")
user_type=ObjectType("User")
review_type=ObjectType("Reviews")
query = ObjectType("Query")
mutation = ObjectType("Mutation")
date_scalar = ScalarType("Date")
request_type=ObjectType("Request")


@date_scalar.serializer
def serialize_date(value):
    return value.isoformat()


book_type.field("genre")(lambda obj, info: obj.genre)
book_type.field("users")(lambda obj, info: obj.users)
book_type.field("reviews")(lambda obj, info: Review.query.filter_by(b_id=obj.id).all())
review_type.field("user")(lambda obj,info: User.query.filter_by(id=obj.u_id).first())
user_type.field("books")(lambda obj,info:obj.books)
user_type.field("requests")(lambda obj,info: Request.query.filter_by(u_id=obj.id).all())
request_type.field("book")(lambda obj, info: Book.query.filter_by(id=obj.b_id).first())
request_type.field("user")(lambda obj, info: User.query.filter_by(id=obj.u_id).first())

#------------------------------------QUERY-----------------------------------------
@query.field("user")
def resolve_user(_, info, user_name=None,name=None,role=None,email=None):
    if user_name:
        res=User.query.filter_by(user_name=user_name).all()
    elif name:
        res=User.query.filter_by(name=name).all()
    elif role:
        res=User.query.filter_by(role=role).all()
    elif email:
        res=User.query.filter_by(email=email).all()
    else:
        res=User.query.filter_by(role="Faculty").all() + User.query.filter_by(role="Student").all()

    return res

@query.field("genres")
def resolve_genre(*_):
    genre=Genre.query.all()
    return genre

@query.field("book")
def resolve_book(*_,name=None):
    if name:
        result=Book.query.filter_by(name=name).first()
        return [result]
    else:
        return Book.query.order_by(Book.name).all()

@query.field("request")
def resolve_request(*_,u_id=None,b_id=None):
    try:    
        if b_id: 
            res=Request.query.filter_by(u_id=u_id,b_id=b_id).all()
            if res[0].deadline<date.today():
                revoke_book_access(u_id=u_id,b_id=b_id)
                res=[]
        elif u_id:
            res=Request.query.filter_by(u_id=u_id).all()
        else:
            res=Request.query.filter_by(status=False).all()
        return res
    except:
        return []

#---------------------------------ADD and EDIT------------------------------------------
@mutation.field("genre")
def mutate_genre(*_,name):
    try:
        gen=Genre(name=name, count=0)
        db.session.add(gen)
        db.session.commit()
        return True
    except:
        return False

@mutation.field("book")
def add_book(*_,name,genre=None,description=""):
    try:
        new_book=Book(name=name,description=description,release_date=date.today(),borrow_count=0,hold_count=0)
        db.session.add(new_book)
        db.session.commit()
        genre=list(genre[0].split(","))
        for gen in genre:
            b_gen=Gtb(b_id=new_book.id,g_id=Genre.query.filter_by(name=gen).first().id)
            db.session.add(b_gen)
        db.session.commit()
        return True
    except:
        return False

@mutation.field("add_review")
def add_review(*_,u_id,b_id,review):
    rev=Review.query.filter_by(u_id=u_id,b_id=b_id).first()
    if rev:
        rev.review=review
    else:
        new_rev=Review(u_id=u_id,b_id=b_id,review=review)
        db.session.add(new_rev)
    db.session.commit()
    return True

@mutation.field("edit_book")
def edit_book(*_,id,name=None,genre=None,description=None):
    try:
        book=Book.query.filter_by(id=int(id)).first()
        book.name=name if name else book.name
        book.description=description if description else book.description
        db.session.commit()
        gen=Gtb.query.filter_by(b_id=id).all()
        for g in gen:
            db.session.delete(g)
        genre=list(genre[0].split(","))
        for g in genre:
            db.session.add(Gtb(b_id=id,g_id=Genre.query.filter_by(name=g).first().id))
        db.session.commit()
        return True
    except:
        return False

@mutation.field("user")
def edit_user(*_,is_premium,user_name):
    if is_premium:
        print(user_name, is_premium)
        user=User.query.filter_by(user_name=user_name).first()
        user.is_premium=True
        db.session.commit()
    return True


@mutation.field("request")
def request_book(*_,u_id,b_id,status=None):
    request=Request.query.filter_by(u_id=u_id,b_id=b_id).first()
    if status:
        request.status=True
        request.deadline=date.today()+timedelta(days=7)
        req=Urb(u_id=u_id,b_id=b_id)
        db.session.add(req)
        book=Book.query.filter_by(id=b_id).first()
        book.borrow_count+=1
        book.hold_count+=1
        user=User.query.filter_by(id=u_id).first()
        user.books_borrowed+=1
        #db.session.add(user)
        db.session.commit()
    else:
        if request:
            db.session.delete(request)
            db.session.commit()
            return False
        request=Request(u_id=u_id,b_id=b_id,status=False,deadline=date.today())
        db.session.add(request)
        db.session.commit()
    return True
#----------------------------------DELETE--------------------------------------------------

@mutation.field("del_genre")
def del_genre(*_,name):
    try:
        gen=Genre.query.filter_by(name=name).first()
        db.session.delete(gen)
        db.session.commit()
        return True
    except(err):
        print(err)
        return False

@mutation.field("delete_book")
def delete_book(*_,name):
    try:
        book=Book.query.filter_by(name=name).first()
        user_rel=Urb.query.filter_by(b_id=book.id).all()
        gen_rel=Gtb.query.filter_by(b_id=book.id).all()
        reviews=Review.query.filter_by(b_id=book.id).all()
        for ele in user_rel:
            db.session.delete(ele)
        for ele in gen_rel:
            db.session.delete(ele)
        for ele in reviews:
            db.session.delete(ele)
        file=join("uploads",(str(book.id) + ".pdf"))
        if exists(file):
            remove(file)
        db.session.delete(book)
        db.session.commit()
        return True
    except:
        return False

@mutation.field("delete_user")
def delete_user(*_,username):
    try:
        user=User.query.filter_by(user_name=username).first()
        borrowed=user.books
        for ele in borrowed:
            ele.hold_count-=1
        rel=Urb.query.filter_by(u_id=user.id).all()
        for ele in rel:
            db.session.delete(ele)
        db.session.delete(user)
        db.session.commit()
        return True
    except:
        return False

@mutation.field("revoke")
def revoke_book_access(*_,u_id,b_id):
    try:
        rel=Urb.query.filter_by(u_id=u_id,b_id=b_id).first()
        req=Request.query.filter_by(u_id=u_id,b_id=b_id).first()
        Book.query.filter_by(id=b_id).first().hold_count-=1
        db.session.delete(req)
        db.session.delete(rel)
        db.session.commit()
        return True
    except:
        return False

#-----------------------------------###---SCHEMA SETUP---###-----------------------------------
schema = make_executable_schema(type_defs,[query,mutation,book_type,date_scalar,review_type,user_type,request_type])