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


const Favorite = () => {

  const [Myfavorite, setMyfavorite] = useState<Iarticle[]>([]);
  const [isLoading, setisLoading] = useState(true);


  const {idFavorites, idBookmarks} = useSelector(favoriteFilter);






useEffect(() => {

  setisLoading(true);
  const results: Iarticle[] = [];
  let requestsLeft = idFavorites.length;

  const makeRequest = async (id: string) => {
    const result = await axios.get(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${id}`);
    results.push(result.data);
    requestsLeft--;

    if (requestsLeft === 0 || !requestsLeft) {
      setMyfavorite(results);
      setisLoading(false);
    }
  };

  if (idFavorites.length === 0) {
    setisLoading(false);
    setMyfavorite([]);
  } else {
    idFavorites.forEach(id => makeRequest(id));
  }
  
  // setMyfavorite(results);
  // setisLoading(false);
}, [idFavorites]);






  return (
    <>
    <div className="context">
      <div className="row-articles">

      

      {
        isLoading ?  [...new Array(8)].map( (_, index) => <Skeleton key = {index}/>  ) : Myfavorite.length ?  
        Myfavorite.map((myfavorite) => <ArticleCart key={myfavorite.id} article={myfavorite}/>) :
        <>
          <div className='no-fav'>You don't add any articles as your favorite. Come back to the <Link to="/"> main page </Link> </div>
        </>
      }
     
        
      </div>
    </div>
    </>
  )
}

export default Favorite