import axios from 'axios';
import React, { useEffect, useState } from 'react'

import guy from '../assets/img/guy.jpg';
import imageann from '../assets/img/image-ann.png'


interface Iarticle {
    id: number;
    title: string;
    text: string;
    author: string;
    date: string;
  }

const ArticleText : React.FC<{ article: Iarticle }> = ({ article }) => {

  const readableDate = new Date(parseInt(article.date) * 1000);

  return (
    <div className="single-article-content">
        <div className="single-article-info">
            <div className="title">{article.title}</div>
            <div className="subtitle">{article.text.slice(0, 100) + "..."}</div>

            <div className="author">
                <a href="#"> <img src={"https://source.unsplash.com/random"} className="author-image"/></a>

                <div className="author-box">
                    <p className="name">Author : <a href="#">{article.author}</a></p>
                    <p className="date">Date : {readableDate.toLocaleString()}</p>
                </div>
            </div>
        </div>

        <img src={"https://source.unsplash.com/random"} className="single-article-pic"></img>

        <div className="single-article-text">
            <p className="title">Here is our super awesome title</p>
            <p className="text">{article.text}</p>
        </div>
    </div>
  )
}

export default ArticleText

