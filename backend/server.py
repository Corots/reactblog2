import asyncio
import datetime
import math
import time
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import jwt
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis
import smtplib



from sqlalchemy import create_engine, Column, Integer, String, LargeBinary, ForeignKey, DateTime, ARRAY
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Table, or_
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

Base = declarative_base()



class Likes(Base):
    __tablename__ = 'likes'
    comment_id = Column(Integer, ForeignKey('comment.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)

class Dislikes(Base):
    __tablename__ = 'dislikes'
    comment_id = Column(Integer, ForeignKey('comment.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)


class FavoriteArticle(Base):
    __tablename__ = 'favorite_article'
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    article_id = Column(Integer, ForeignKey('article.id'), primary_key=True)
   
    
class BookmarkArticle(Base):
    __tablename__ = 'bookmark_article'
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    article_id = Column(Integer, ForeignKey('article.id'), primary_key=True)





class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    img = Column(String)
    password = Column(String, nullable=False)
    email = Column(String, nullable=False)

    comments = relationship('Comment', backref='author', lazy=True)
    articles = relationship('Article', backref='author', lazy=True)
    favorite_articles = relationship("Article", secondary="favorite_article", back_populates="favorited_by")
    bookmark_articles = relationship("Article", secondary="bookmark_article", back_populates="bookmarked_by")

    liked_comment  = relationship("Comment", secondary="likes", back_populates="who_liked")
    disliked_comment  = relationship("Comment", secondary="dislikes", back_populates="who_disliked")



    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "img": self.img,
        }
    
class ArticleModel(BaseModel):
    title:str
    text : str
    date: str                
    author_id: int    



class Article(Base):
    __tablename__ = 'article'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    text = Column(String)
    date = Column(DateTime, default= datetime.datetime.now())
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    comments = relationship('Comment', backref='article', lazy=True)
    bookmarked_by = relationship("User", secondary="bookmark_article", back_populates="bookmark_articles")
    favorited_by = relationship("User", secondary="favorite_article", back_populates="favorite_articles")
    # author = relationship("User", back_populates="articles")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "text": self.text,
            "date": self.date.strftime("%Y-%m-%d %H:%M:%S"),
            "author": self.author.username,
            "img" : self.author.img,
        }


class CommentModel(BaseModel):
    id : int
    text : str
    reply_id : int | None           
    likes: int    
    dislikes: int       
    date: str                
    author : str             
    author_id: int    
    article_id : int    


class Comment(Base):
    __tablename__ = 'comment'
    id = Column(Integer, primary_key=True)
    userid = Column(Integer, ForeignKey('users.id'), nullable=False)
    articleid = Column(Integer, ForeignKey('article.id'))
    reply_id = Column(Integer, ForeignKey("comment.id"))
    text = Column(String)
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)
    date = Column(DateTime, default=datetime.datetime.now())

    user = relationship("User", back_populates="comments", overlaps="author")    
    # remote_side=[id]
    # reply = relationship("Comment", backref="replies", cascade="all, delete-orphan", remote_side=[id], single_parent = True)
    replies = relationship("Comment", back_populates="parent", remote_side=[id])
    parent = relationship("Comment", back_populates="replies", remote_side=[reply_id], cascade="all, delete-orphan")

    who_liked  = relationship("User", secondary="likes", back_populates="liked_comment")
    who_disliked  = relationship("User", secondary="dislikes", back_populates="disliked_comment")



    def to_dict(self, user : User = None):
        data = {
            "id": self.id,
            "text": self.text,
            "reply_id" : self.reply_id,
            "likes": len(self.who_liked),
            "dislikes": len(self.who_disliked),
            "date": self.date.strftime("%Y-%m-%d %H:%M:%S"),
            "author" : self.author.username,
            "author_id": self.user.id,
            "article_id" : self.articleid
        }

        if user:
            data["liked"] = user in self.who_liked
            data["disliked"] = user in self.who_disliked

        return data


# 
app = FastAPI(root_path='/api')

token_exp_minutes = 30
restore_token_exp_minutes = 60
access_secret = "secret_key"
refresh_secret = "refresh_secret_key"
restore_secret = "restore_secret"

# my_redis = redis.from_url("redis://localhost", encoding="utf-8", decode_responses=True)

# @app.on_event("startup")
# async def startup():
#     await FastAPILimiter.init(my_redis)



@app.get("/")
async def read_root():
    return {"Hello": "World"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)






engine = create_engine("postgresql://postgres:newsecret@localhost:5432/reactblog")
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()


def check_username_avaliability(username : str):
    existing_user = session.query(User).filter_by(username=username).first()
    if existing_user:
        raise HTTPException(status_code=402, detail="Username already exists")
    else:
        return True


def add_user_to_db(username: str, img: str, password: bytes, email : str,  favlist: list[int], bmlist: list[int] ):

    existing_user = check_username_avaliability(username)

    new_user = User(username=username, img=img, password=password, email = email)
    session.add(new_user)
    session.commit()

    fav_articles = []
    for fav in favlist:
        article = session.query(Article).filter_by(id=fav).first()
        if article:
            fav_articles.append(FavoriteArticle(user_id=new_user.id, article_id=article.id))

    bm_articles = []
    for bm in bmlist:
        article = session.query(Article).filter_by(id=bm).first()
        if article:
            bm_articles.append(BookmarkArticle(user_id=new_user.id, article_id=article.id))

    session.add_all(fav_articles + bm_articles)
    session.commit()

    return new_user


def get_all_users() -> list[User]:
    users = session.query(User).all()
    session.close()
    return users


def get_user_by_id(user_id: int):
    return session.query(User).get(user_id)


def get_article_by_id(article_id: int):
    return session.query(Article).filter_by(id=article_id).first()

def get_comment_by_id(comment_id: int):
    return session.query(Comment).filter_by(id=comment_id).first()






# ! Articles

def add_article(user: User, title: str, text: str):
    if user:
        article = Article(title=title, text=text, author_id=user.id)
        session.add(article)
        session.commit()
        return article
    return None


def edit_article(user: User, article_id: int, title: str, text: str):
    article = get_article_by_id(article_id)
    if article and article.author_id == user.id:
        article.title = title
        article.text = text
        session.commit()
        return True
    return False


def delete_article(user: User, article_id: int):
    article = get_article_by_id(article_id)
    if article and article.author_id == user.id:
        session.delete(article)
        session.commit()
        return True
    return False




# ! / articles

# ! bookmarls and favorite
def add_bm(user: User, bm: str):
    user.bmlist.append(bm)
    session.commit()


def remove_bm(user: User, bm: str):
    if bm in user.bmlist:
        user.bmlist.remove(bm)
        session.commit()
        return True
    return False

# def add_fav(user: User, fav: str):
#     user.favlist.append(fav)
#     session.commit()
#     return True

# def remove_fav(user: User, fav: str):
#     if fav in user.favlist:
#         user.favlist.remove(fav)
#         session.commit()
#         return True
#     return False
# ! / bookm favor

# ! comments

def add_comment(user: User, article_id: int, text: str, reply_id: Optional[int]=None):
    article = get_article_by_id(article_id)
    if article:
        comment = Comment(userid=user.id, text=text, reply_id=reply_id)
        article.comments.append(comment)
        session.commit()
        return comment
    return None

def edit_comment(user : User, comment_id: int, text: str):
    comment = get_comment_by_id(comment_id)
   
    if comment and comment in user.comments:
        comment.text = text
        session.commit()
        return True
    return False

def delete_comment(user : User, comment_id: int):
    comment = get_comment_by_id(comment_id)
    if comment and comment in user.comments:
        session.delete(comment)
        session.commit()
        return True
    return False



# ! / comments


def verify_password(username: str, password: str):
    user : User = session.query(User).filter_by(username=username).first()
    if user and bcrypt.checkpw(password.encode(), str(user.password).encode()):
        return user
    return None


def get_current_user(token: str = None):

    if token is None:
        return User(id=-1, username="anonymous")

    try:
        payload = jwt.decode(token, access_secret, algorithms = ["HS256"])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise jwt.InvalidTokenError("Access token error: 'sub' claim not found")
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            raise jwt.InvalidTokenError("Access token error: user not found")

        return user
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=401, detail="Access token error: " + str(e))
    except (jwt.DecodeError, jwt.InvalidTokenError) as e:
        raise HTTPException(status_code=400, detail="Access token error: " + str(e))





def get_current_user_restore_password(token: str):
    try:
        payload = jwt.decode(token, restore_secret, algorithms = ["HS256"])
        user_id: str = payload.get("sub")

        if user_id is None:
            raise jwt.InvalidTokenError("Access token error: 'sub' claim not found")
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            raise jwt.InvalidTokenError("Access token error: user not found")

        return user
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=401, detail="Access token error: " + str(e))
    except (jwt.DecodeError, jwt.InvalidTokenError) as e:
        raise HTTPException(status_code=400, detail="Access token error: " + str(e))



def get_current_expired_user(token: str):
    try:
        payload = jwt.decode(token, access_secret, algorithms=["HS256"], options={"verify_exp": False},)
        user_id: str = payload.get("sub")

        if user_id is None:
            raise jwt.InvalidTokenError("Access token error: 'sub' claim not found")
        
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            raise jwt.InvalidTokenError("Access token error: user not found")

        return user
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=401, detail="Access token error: " + str(e))
    except (jwt.DecodeError, jwt.InvalidTokenError) as e:
        raise HTTPException(status_code=400, detail="Access token error: " + str(e))
    




@app.get("/avatar")
def get_avatar(current_user: User = Depends(get_current_user)):
    return {"data" : current_user.img}





# ! Favorite and bookmarks api


@app.post("/article/{article_id}/bookmark", tags=["Fav/Bookmarks"])
async def bookmark_article(article_id: int, current_user: User = Depends(get_current_user)):
    article = get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=400, detail="Article not found")


    # Check if article is already in bookmark_articles for user
    bookmark_article = session.query(BookmarkArticle).filter(
        BookmarkArticle.user_id == current_user.id,
        BookmarkArticle.article_id == article_id
    ).first()

    if bookmark_article:
        raise HTTPException(status_code=400, detail="Article already bookmarked")

    # Add the article to the user's bookmark_articles
    new_bookmark = BookmarkArticle(user_id=current_user.id, article_id=article_id)
    session.add(new_bookmark)
    session.commit()
    return {"message": "Article bookmarked"}

@app.delete("/article/{article_id}/bookmark", tags=["Fav/Bookmarks"])
async def unbookmark_article(article_id: int, current_user: User = Depends(get_current_user)):
    article = get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=400, detail="Article not found")


    # Check if article is already in bookmark_articles for user
    bookmark_article = session.query(BookmarkArticle).filter(
        BookmarkArticle.user_id == current_user.id,
        BookmarkArticle.article_id == article_id
    ).first()

    if not bookmark_article:
        raise HTTPException(status_code=400, detail="Article not bookmarked")

    # Remove the article from the user's bookmark_articles
    session.delete(bookmark_article)
    session.commit()
    return {"message": "Article unbookmarked"}

@app.post("/article/{article_id}/favorite", tags=["Fav/Bookmarks"])
async def favorite_article(article_id: int, current_user: User = Depends(get_current_user)):
    article = get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=400, detail="Article not found")


    # Check if article is already in favorite_articles for user
    favorite_article = session.query(FavoriteArticle).filter(
        FavoriteArticle.user_id == current_user.id,
        FavoriteArticle.article_id == article_id
    ).first()

    if favorite_article:
        raise HTTPException(status_code=400, detail="Article already favorited")

    # Add the article to the user's favorite_articles
    new_favorite = FavoriteArticle(user_id=current_user.id, article_id=article_id)
    session.add(new_favorite)
    session.commit()
    return {"message": "Article favorited"}

@app.delete("/article/{article_id}/favorite", tags=["Fav/Bookmarks"])
async def unfavorite_article(article_id: int, current_user: User = Depends(get_current_user)):
    article = get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=400, detail="Article not found")


    # Check if article is already in favorite_articles for user
    favorite_article = session.query(FavoriteArticle).filter(
        FavoriteArticle.user_id == current_user.id,
        FavoriteArticle.article_id == article_id
    ).first()

    if not favorite_article:
        raise HTTPException(status_code=400, detail="Article not favorited")

    # Remove the article from the user's favorite_articles
    session.delete(favorite_article)
    session.commit()
    return {"message": "Article unfavorited"}


@app.get("/user/favorites", tags=["Fav/Bookmarks"])
async def get_favorite_articles(current_user: User = Depends(get_current_user)):
    articles = [article.to_dict() for article in current_user.favorite_articles]
    return {"articles": articles}


@app.get("/user/bookmarks", tags=["Fav/Bookmarks"])
async def get_bookmark_articles(current_user: User = Depends(get_current_user)):
    articles = [article.to_dict() for article in current_user.bookmark_articles]
    return {"articles": articles}





# ! / Favorite and bookmarks api


# ! Comments
@app.post("/article/{article_id}/comment", tags=["Comments"])
async def add_comment_to_user(article_id : int, reply_id: Optional[int] = None, text: str = Body(...),  date : str = Body(...), current_user: User = Depends(get_current_user)):
    if add_comment(current_user,article_id, text, reply_id):
        return {"message": "Comment added successfully"}
    raise HTTPException(status_code=400, detail="Error adding comment")

@app.put("/comment/{comment_id}", tags=["Comments"])
async def edit_comment_to_user(comment_id: int, text: str = Body(...), date : str = Body(...),  current_user: User = Depends(get_current_user)):
    if edit_comment(current_user, comment_id, text):
        return {"message": "Comment edited successfully"}
    raise HTTPException(status_code=400, detail="Error editing comment")

@app.delete("/comment/{comment_id}", tags=["Comments"])
async def delete_comment_from_user(comment_id: int, current_user: User = Depends(get_current_user)):
    if delete_comment(current_user, comment_id):
        return {"message": "Comment deleted successfully"}
    raise HTTPException(status_code=400, detail="Error deleting comment")


@app.get("/article/{article_id}/comments", tags=["Comments"])
async def get_article_comments(article_id: int, sortBy : str, order : str, current_user: User = Depends(get_current_user)):
    article = get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=400, detail="Article not found")

    comments : list[Comment] = article.comments
    comments.sort(key = lambda c : len(c.who_liked), reverse = True) if sortBy == 'likes' else comments.sort(key = lambda c : c.date, reverse = True)
    
    if current_user.id == -1:
        return [comment.to_dict() for comment in comments]
    elif current_user:
        return [comment.to_dict(current_user) for comment in comments]
    


@app.get("/comment/{comment_id}", tags=["Comments"])
async def get_single_comments(comment_id: int, current_user: User = Depends(get_current_user)):

    comment : Comment = get_comment_by_id(comment_id)
    if current_user.id == -1:
        return comment.to_dict()
    elif current_user:
        return comment.to_dict(current_user)

@app.post("/comment/{comment_id}/like")
async def like_comment(comment_id: int, current_user: User = Depends(get_current_user)):
    if current_user:
        comment : Comment = get_comment_by_id(comment_id)
        if not comment :
            raise HTTPException(status_code=413, detail="Comment not found")

        if comment in current_user.disliked_comment:
            current_user.disliked_comment.remove(comment)

        if comment in current_user.liked_comment:
            current_user.liked_comment.remove(comment)
            return {"result" : "like removed"}
        else:
            current_user.liked_comment.append(comment)
            return {"result" : "like added"}


@app.post("/comment/{comment_id}/dislike")
async def like_comment(comment_id: int, current_user: User = Depends(get_current_user)):
    if current_user:
        comment : Comment = get_comment_by_id(comment_id)
        if not comment :
            raise HTTPException(status_code=413, detail="Comment not found")

        if comment in current_user.liked_comment:
            current_user.liked_comment.remove(comment)


        if comment in current_user.disliked_comment:
            current_user.disliked_comment.remove(comment)
            return {"result" : "like removed"}
        else:
            current_user.disliked_comment.append(comment)
            return {"result" : "like added"}






# ! / Comments


# ! Article api

@app.post("/article", tags=["Articles"])
async def add_article_api(title: str = Body(...), text: str = Body(...), current_user: User = Depends(get_current_user)):
    article = add_article(current_user, title, text)
    if article:
        return {"message": "Article added successfully", "id": article.id}
    raise HTTPException(status_code=400, detail="Error adding article")


@app.put("/article/{article_id}", tags=["Articles"])
async def edit_article_api(article_id: int, title: str = Body(...), text: str = Body(...), current_user: User = Depends(get_current_user)):
    if edit_article(current_user, article_id, title, text):
        return {"message": "Article edited successfully"}
    raise HTTPException(status_code=400, detail="Error editing article")


@app.delete("/article/{article_id}", tags=["Articles"])
async def delete_article_api(article_id: int, current_user: User = Depends(get_current_user)):
    if delete_article(current_user, article_id):
        return {"message": "Article deleted successfully"}
    raise HTTPException(status_code=400, detail="Error deleting article")



@app.get("/articles", tags=["Articles"])
async def search_articles(q: str = None, title: str = None, author: str = None, sort_by: str = "date", order: str = "desc", page : int = 1):
    query = session.query(Article)
    
    if q:
        query = query.filter(or_(Article.text.contains(q), Article.title.contains(q)))
    if title:
        query = query.filter(Article.title.contains(title))
    if author:
        query = query.join(User, User.id == Article.author_id).filter(User.username.contains(author))

    if sort_by == "date":
        if order == "desc":
            query = query.order_by(Article.date.desc())
        else:
            query = query.order_by(Article.date.asc())
    elif sort_by == "author":
        query = query.join(User).order_by(User.username)
    

    articles = [article.to_dict() for article in query.offset((max(page,1) - 1) * 8).limit(8).all()]
    total_articles = query.count()
    pages = math.ceil(total_articles / 8)
    return {"articles": articles, "pages": pages}



@app.get("/article/{article_id}", tags=["Articles"])
async def read_article(article_id: int):
    article = session.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=400, detail="Article not found")
    return article.to_dict()


# ! / article api


# ! Register and logging


def make_hashed_password(password : str):
    hashed_password = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
    hashed_password = hashed_password.decode('utf8')
    return hashed_password



@app.post("/add_user", tags=["Registration/Auth"])
async def add_user(username: str = Body(...),  password: str = Body(...), email : str = Body(...) ):
    hashed_password = make_hashed_password(password)
    user : User = add_user_to_db(username, "img", hashed_password, email,  [], [])


    access_token = jwt.encode({"sub": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=token_exp_minutes)}, access_secret)        
    refresh_token = jwt.encode({"sub": user.id}, refresh_secret)   

    return {"success" : True, "access_token": access_token, "refresh_token" : refresh_token, "userdata" : 
                {"logged" : True, 
                "img" : user.img, 
                "username" : user.username, 
                "idFavorites" : [article.id for article in user.favorite_articles],
                "idBookmarks" : [article.id for article in user.bookmark_articles],
                }  
            }


@app.get("/check_user/{username}")
async def check_user(username: str):
    if check_username_avaliability(username):
        return {"result" : "username is free"}




@app.post("/login", tags=["Registration/Auth"])
async def login(username: str = Body(...), password: str = Body(...),):
    user = verify_password(username, password)
    if user:
        # Generate a token to be returned to the client
        access_token = jwt.encode({"sub": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=token_exp_minutes)}, access_secret)        
        refresh_token = jwt.encode({"sub": user.id}, refresh_secret)   

        return {"success" : True, "access_token": access_token, "refresh_token" : refresh_token, "userdata" : 
            {"logged" : True, 
            "img" : user.img, 
            "username" : user.username, 
            "idFavorites" : [article.id for article in user.favorite_articles],
            "idBookmarks" : [article.id for article in user.bookmark_articles],
            }  
        
         }
    else:
        return {"success" : False, "message" : "Incorrect username or password"}
        # raise HTTPException(status_code=400, detail="Incorrect username or password")


@app.get("/user", tags=["Registration/Auth"])
async def get_user_info(current_user: User = Depends(get_current_user)):
    user_dict = current_user.to_dict()
    user_dict["idFavorites"] = [article.id for article in current_user.favorite_articles]
    user_dict["idBookmarks"] = [article.id for article in current_user.bookmark_articles]
    return user_dict


@app.get("/refresh_token", tags=["Registration/Auth"])
async def refresh_token(refresh_token : str, current_user: User = Depends(get_current_expired_user)):

    try:
        refresh_payload = jwt.decode(refresh_token, refresh_secret, algorithms = ["HS256"], verify=False)
        user_id: str = refresh_payload.get("sub")

        if user_id is None:
            raise jwt.InvalidTokenError("Refresh token error: 'sub' claim not found")
        if user_id != current_user.id:
            raise jwt.InvalidTokenError("Refresh token error: refresh token and access token are for different users")


        access_token = jwt.encode({"sub": current_user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=token_exp_minutes)}, access_secret) 
        return {"access_token" : access_token}
        
    except (jwt.DecodeError, jwt.InvalidTokenError) as e:
        raise HTTPException(status_code=400, detail="Refresh token error: " + str(e))    

    except:
        raise HTTPException(status_code=400, detail="Refresh Somethig wrong " + str(e))    



def get_user_id_from_username(username: str):
    # or_(User.username == username, User.email == username)
    user = session.query(User).filter(User.username == username).first()
    if user:
        return user
    return None

def get_user_id_from_email(email: str):
    # or_(User.username == username, User.email == username)
    user = session.query(User).filter(User.email == email).first()
    if user:
        return user
    return None


def send_reset_password_email(recipient, body):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "n79807332203@gmail.com" # Replace with your Gmail address
    smtp_password = "s12l4m5yu4go" # Replace with your Gmail password

    message = f"""\
    From: {smtp_user}
    To: {recipient}
    Subject: Reset password for myawesomeapp.me

    {body}"""

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, recipient, message)


@app.get("/reset_password", tags=["Registration/Auth"])
async def reset_password(email: Optional[str] = None, username: Optional[str] = None):


    if username:
        user = get_user_id_from_username(username)
    elif email:
        user = get_user_id_from_email(email)
    else:
        raise HTTPException(status_code=413, detail="No information is given")  

    if not user:
        raise HTTPException(status_code=410, detail="Such user in not found")    
        # return JSONResponse(content={"error": "Username or email not found"})
    
    token = jwt.encode(
        {"sub": user.id, "reset_password": True, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=restore_token_exp_minutes)},
        restore_secret,
        algorithm="HS256",
    )
    
    reset_password_link = f"https://myawesomeapp.me/reset_password?token={token}"
    # send_email("recovery@myawesomeapp.me", "n79807332203@gmail.com", "Test subject", "Test body")
    # send_reset_password_email(user.email, reset_password_link)
    
    return {"message": reset_password_link}


@app.post("/reset_password", tags=["Registration/Auth"])
async def post_reset_password(password: str = Body(...), current_user: User = Depends(get_current_user_restore_password)):
    if current_user:
        current_user.password = make_hashed_password(password)
        session.add(current_user)
        session.commit()
        return {"result" : "Password had changed"}


@app.get("/check_reset_token", tags=["Registration/Auth"])
async def check_reset_token(current_user: User = Depends(get_current_user_restore_password)):
    if current_user:
        return {"result" : "allowed to change password using thin token"}



# ! / Register and logging
import ssl

def send_email(sender, recipient, subject, body):
    smtp_server = "mail.privateemail.com"
    smtp_port = 465
    smtp_user = "recovery@myawesomeapp.me" # Replace with your Namecheap email address
    smtp_password = "recoveryh0rse" # Replace with your Namecheap email password

    message = f"""\
    From: {sender}
    To: julia.mcgregus@smartemailers.com
    Subject: {subject}

    This is the mlrch-8b10893ce
    {body}"""

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(smtp_server, smtp_port, context= context) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(sender, 'julia.mcgregus@smartemailers.com', message)

if __name__ == "__main__":
    send_email("recovery@myawesomeapp.me", "n79807332203@gmail.com", "Test subject 2", "Test body 2")




#     @ 	MX 	10 	mx1.privateemail.com
# @ 	MX 	10 	mx2.privateemail.com
# @ 	TXT 		v=spf1 include:spf.privateemail.com ~all