class Development():
    DEBUG= True
    UPLOAD_FOLDER="uploads"
    STATIC_FOLDER="static"
    SQLALCHEMY_DATABASE_URI="sqlite:///database.sqlite3"
    JWT_SECRET_KEY = "Mistborn:The Final Empire"
    JWT_JSON_KEY = "token"
    JWT_REFRESH_JSON_KEY = "refresh_token"
    JWT_ACCESS_TOKEN_EXPIRES=False