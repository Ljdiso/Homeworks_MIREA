from datetime import timedelta
from time import time

from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
# from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel

from app.database.database import DataBase
from app.dependencies import get_db, get_settings, get_sql_alchemy_engine
from app.routers import users, news
from app.websockets import chat


settings = get_settings()

app = FastAPI(title="Дисциплина УИТИиА", version="1.0",
              dependencies=[Depends(get_db)])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount('/static', StaticFiles(directory='app/static'), name='static')
app.include_router(users.router)
app.include_router(news.router)
app.add_api_websocket_route("/chat", chat.websocket_chat)


class JWTSettings(BaseModel):
    authjwt_secret_key: str = settings.authjwt_secret_key
    authjwt_access_token_expires: int = timedelta(hours=5)
    authjwt_refresh_token_expires: int = timedelta(weeks=4)
    authjwt_token_location: set = {"cookies"}
    authjwt_cookie_csrf_protect: bool = False


@AuthJWT.load_config
def get_config():
    return JWTSettings()


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


@app.on_event("startup")
def startup(db: Session = Depends(get_db)):
    start = time()
    connected = False
    while not connected:
        try:
            DataBase.metadata.create_all(bind=get_sql_alchemy_engine())
            connected = True
        except OperationalError as e:
            if time() - start > settings.timeout:
                raise e
