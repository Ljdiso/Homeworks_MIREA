from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.news import NewsInput
from app.models.users import UserRead
from app.database.news import News

from app.telegram_bot import post_news, delete_news


def create_news(n: NewsInput, s: Session, u: UserRead = None):
    message_id = post_news(n, u)

    news = News()
    news.id = message_id
    news.title = n.title
    news.content = n.content
    news.user = u.email

    s.add(news)
    try:
        s.commit()
        return news
    except IntegrityError:
        delete_news(message_id)
        return
    

def get_all_news(s: Session, limit: int = 100, skip: int = 0):
    return s.query(News).limit(limit).offset(skip).all()


def delete_news_from_db(s: Session, post_id: int):
    try:
        delete_news(post_id)
    except:
        pass
    news = s.query(News).filter(News.id == post_id).first()
    s.delete(news)
    try:
        s.commit()
        return news
    except:
        s.rollback()
        return None



