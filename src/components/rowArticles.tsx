import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ArticleCart  from './ArticleCart'

import Search, { sortList } from './search';
    

import { selectFilter } from '../redux/filter/selectors';
import { useSelector } from 'react-redux';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { FilterSliceState, SortPropertyEnum } from '../redux/filter/types';
import { setSearch } from '../redux/filter/slice';
import { useAppDispatch } from '../redux/store';
import Skeleton from './ArticleCart/skeleton';

type Props = {}


export interface Iarticle {
  id: string;
  title: string;
  text: string;
  author: string;
  date: number;
}


const RowArticles = (props: Props) => {

  const navigate = useNavigate()

  const [articles, setArticles] = useState<Iarticle[]>([]);
  const [isLoading, setisLoading] = useState(true);

  const searchParams = useSelector(selectFilter);
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (window.location.search){

      const params = window.location.search.substring(1);
      const result = qs.parse(params)


      let sort_property : SortPropertyEnum = SortPropertyEnum.DATE_ASC
      if (typeof result.SortProperty == 'string'){
        const sort = sortList.find(obj => obj.sortProperty.valueOf() === result.SortProperty)
          if (sort){
            sort_property = sort.sortProperty
          }
      }


      const searchState : FilterSliceState = {
        SearchText : (typeof result.SearchText == 'string') ? result.SearchText : '',
        SearchAuthor : (typeof result.SearchAuthor == 'string') ? result.SearchAuthor : '',
        SortProperty : sort_property,
      };


      dispatch(setSearch(searchState));


    }
  }, [])


  interface ExampleObject {
    author?: string;
    title?: string;

    sortBy : string;
    order : string;
}

  
  


  


  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const finalSearchParams : ExampleObject = 
      {
        sortBy : searchParams.SortProperty.replace('-', ''),
        order : searchParams.SortProperty.includes('-') ? 'asc' : 'desc',
      }
      if (searchParams.SearchAuthor) finalSearchParams.author = searchParams.SearchAuthor
      if (searchParams.SearchText) finalSearchParams.title = searchParams.SearchText



      const result = await axios.get(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles`, { params: finalSearchParams } );
      setArticles(result.data);

      console.log('data from rowarticles element', result.data);
      
    };

    fetchData().then(() => {setisLoading(false);});
    
  }, [searchParams]);


  useEffect(() => {
    let queryString = "?";
    for (const [key, value] of Object.entries(searchParams)) {
        if (value) {

            if  (!(key == 'SortProperty' && value == '-date')) queryString += `${key}=${value}&`;
        }
    }
    queryString = queryString.slice(0, -1);


    navigate(queryString);

  }, [searchParams])

  




  return (
    <>
    <Search/>
    <div className="context">
      <div className="row-articles">

      {
        isLoading ?  [...new Array(8)].map( (_, index) => <Skeleton key = {index}/>  ) : articles.map((article) => <ArticleCart key={article.id} article={article}/>)
      }

      </div>
    </div>
    </>
  )
}

export default RowArticles