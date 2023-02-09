import React from 'react'

import imageann from '../../assets/img/image-ann.png';
import bookmark from '../../assets/bookmark.svg';
import guy from '../../assets/img/guy.jpg';
import { Link } from 'react-router-dom';
import IconCheckboxes from '../MaterialUI/IconCheckboxes';
import { Iarticle } from '../rowArticles';
import Avatar from '@mui/material/Avatar';






const ArticleCart  : React.FC<{ article: Iarticle }> = ({ article }) => {

    const truncatedText = article.text.slice(0, 100) + "...";

    
    

    

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
                    <Avatar alt={article.author} src="sdf" />
                    {/* <a href="#"> <img src={article.img} className="author-image"/></a> */}

                    <div className="author-box">
                        <p className="name">Author : <a href="#">{article.author}</a></p>
                        <p className="date">Date : {article.date}</p>
                    </div>
                </div>
            </div>
  )
}

export default ArticleCart