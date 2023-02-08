#  Use pydantic to read .env config instead of self-written parser 
from typing import List
from pydantic import BaseSettings


class Settings(BaseSettings):

    token_exp_minutes : str
    restore_token_exp_minutes : str
    access_secret : str
    refresh_secret : str
    restore_secret : str

    user_db : str
    pass_db : str
    host_db : str
    port_db : str
    dbname : str

    class Config:
        env_file = './backend/file.env'
        env_file_encoding = 'utf-8'


config = Settings()