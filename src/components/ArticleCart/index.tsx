import React from 'react'

import imageann from '../../assets/img/image-ann.png';
import bookmark from '../../assets/bookmark.svg';
import guy from '../../assets/img/guy.jpg';
import { Link } from 'react-router-dom';
import IconCheckboxes from '../MaterialUI/IconCheckboxes';
import { Iarticle } from '../rowArticles';






const ArticleCart  : React.FC<{ article: Iarticle }> = ({ article }) => {

    const truncatedText = article.text.slice(0, 100) + "...";
    const readableDate = new Date(article.date * 1000);

    
    

    

  return (
    <div className="article-cart">
                
                    {/* <img src={bookmark} className="addfav" alt="image description"/> */}
                    <div className="addfav">
                        <IconCheckboxes articleId = {article.id}/>
                    </div>
                <a href="#" className="img-href">
                    <img className="image-zone" src={imageann} />
                </a>



                <Link to={`/article/${article.id}`} className="title">{article.title}</Link>
                <Link to={`/article/${article.id}`} className="subtitle">
                    {truncatedText}
                </Link>



                <div className="author">
                    <a href="#"> <img src={guy} className="author-image"/></a>

                    <div className="author-box">
                        <p className="name">Author : <a href="#">{article.author}</a></p>
                        <p className="date">Date : {readableDate.toLocaleString()}</p>
                    </div>
                </div>
            </div>
  )
}

export default ArticleCart