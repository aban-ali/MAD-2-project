from ariadne import ObjectType, gql, make_executable_schema,graphql_sync
from .database import db,User

type_defs = """
    type Query {
        user(
            user_name: String
            name: String
            role: String
            email: String
        ):[User]!
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
"""

query = ObjectType("Query")

@query.field("user")
def resolve_hello(_, info, user_name=None,name=None,role=None,email=None):
    if user_name:
        res=User.query.filter_by(user_name=user_name).all()
    elif name:
        res=User.query.filter_by(name=name).all()
    elif role:
        res=User.query.filter_by(role=role).all()
    elif email:
        res=User.query.filter_by(email=email).all()
    else:
        res=list((User.query.first()))
    return res



schema = make_executable_schema(type_defs,query)