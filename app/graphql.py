from ariadne import ObjectType, gql, make_executable_schema,graphql_sync
from .database import db,User,Genre,Urb,Review,Rtb,Book,Gtb
from datetime import date

type_defs = """
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
    }
    type User {
        id:Int
        user_name:String
        name:String
        role:String
        email:String
        password:String
        is_premium:Boolean
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
        borrow_count:Int
        hold_count:Int
        genre:[Genre]
        reviews:[Reviews]
    }
    type Reviews{
        review:String
        rating:Int
    }
    type Mutation{
        genre(name:String!):Boolean!
        del_genre(name:String!):Boolean!
        book(
            name:String!
            genre:[String]
            description:String
            ):Boolean!
        edit_book(
            id:String!
            name:String
            genre:[String]
            description:String
            ):Boolean!
        delete_book(name:String!):Boolean!
        delete_user(username:String!):Boolean!
    }
"""
book_type=ObjectType("Books")
query = ObjectType("Query")
mutation = ObjectType("Mutation")

book_type.field("genre")(lambda obj, info: obj.genre)
book_type.field("reviews")(lambda obj, info: obj.reviews)


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
        res=User.query.all()
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
        return Book.query.all()


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
        for gen in genre:
            b_gen=Gtb(b_id=new_book.id,g_id=Genre.query.filter_by(name=gen).first().id)
            db.session.add(b_gen)
        db.session.commit()
        return True
    except:
        return False

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
    pass

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


schema = make_executable_schema(type_defs,[query,mutation,book_type])