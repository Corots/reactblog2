import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ArticleCart  from './ArticleCart'

import Search, { sortList } from './search';
    

import { selectFilter } from '../redux/filter/selectors';
import { useSelector } from 'react-redux';
import { FilterSliceState, SortPropertyEnum } from '../redux/filter/types';
import { setSearch } from '../redux/filter/slice';
import { useAppDispatch } from '../redux/store';
import Skeleton from './ArticleCart/skeleton';



import { Iarticle } from './rowArticles';
import { favoriteFilter } from '../redux/favorite/selectors';
import { Link } from 'react-router-dom';


const Bookmarks = () => {

  const [Mybookmarks, setMybookmarks] = useState<Iarticle[]>([]);
  const [isLoading, setisLoading] = useState(true);


  const {idFavorites, idBookmarks} = useSelector(favoriteFilter);






useEffect(() => {

  setisLoading(true);
  const results: Iarticle[] = [];
  let requestsLeft = idBookmarks.length;

  const makeRequest = async (id: number) => {
    const result = await axios.get(`https://myawesomeapp.me/api/article/${id}`);
    results.push(result.data);
    requestsLeft--;

    if (requestsLeft === 0 || !requestsLeft) {
      setMybookmarks(results);
      setisLoading(false);
    }
  };

  if (idBookmarks.length === 0) {
    setisLoading(false);
    setMybookmarks([]);
  } else {
    idBookmarks.forEach(id => makeRequest(id));
  }
  
  // setMybookmarks(results);
  // setisLoading(false);
}, [idBookmarks]);






  return (
    <>
    <div className="context">
      <div className="row-articles">

      {isLoading || Mybookmarks.length ? <div className='no-fav'>Bookmarked articles </div> : <></>}

      {
        isLoading ?  [...new Array(8)].map( (_, index) => <Skeleton key = {index}/>  ) : Mybookmarks.length ?  
        Mybookmarks.map((myfavorite) => <ArticleCart key={myfavorite.id} article={myfavorite}/>) :
        <>
          <div className='no-fav'>You don't add any articles as your bookmarks. Come back to the <Link to="/"> main page </Link> </div>
        </>
      }
     
        
      </div>
    </div>
    </>
  )
}

export default Bookmarks