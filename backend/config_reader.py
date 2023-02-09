#  Use pydantic to read .env config instead of self-written parser 
from typing import List
from pydantic import BaseSettings


class Settings(BaseSettings):
    # DB
    db_user : str
    db_passw : str
    db_host : str
    db_port : str
    db_name : str

    #configuration
    token_exp_minutes : int
    restore_token_exp_minutes : int
    access_secret : str
    refresh_secret : str
    restore_secret : str

    class Config:
        env_file = './backend/file.env'
        env_file_encoding = 'utf-8'


config = Settings()

