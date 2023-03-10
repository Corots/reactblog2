import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ArticleCart  from './ArticleCart'

import Search, { sortList } from './search';

import ReactPaginate from 'react-paginate';

    

import { selectFilter } from '../redux/filter/selectors';
import { useSelector } from 'react-redux';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';
import { FilterSliceState, SortPropertyEnum } from '../redux/filter/types';
import { setPage, setSearch } from '../redux/filter/slice';
import { useAppDispatch } from '../redux/store';
import Skeleton from './ArticleCart/skeleton';
import CheckApi from './auth/useAuth';

type Props = {}


export interface Iarticle {
  id: number;
  title: string;
  text: string;
  author: string;
  date: string;
  img : string
}


const RowArticles = (props: Props) => {

  const navigate = useNavigate()

  const [articles, setArticles] = useState<Iarticle[]>([]);
  const [isLoading, setisLoading] = useState(true);

  const [pageCount, setPageCount] = useState<number>()


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
        page : (typeof Number(result.page) == 'number') ? Number(result.page) : 1
      };


      dispatch(setSearch(searchState));


    }
  }, [])


  interface ExampleObject {
    author?: string;
    q?: string;

    sortBy : string;
    order : string;
    page? : number;
}

  
  


  


  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
      const finalSearchParams : ExampleObject = 
      {
        sortBy : searchParams.SortProperty.replace('-', ''),
        order : searchParams.SortProperty.includes('-') ? 'asc' : 'desc',
        page : searchParams.page,
      }
      if (searchParams.SearchAuthor) finalSearchParams.author = searchParams.SearchAuthor
      if (searchParams.SearchText) finalSearchParams.q = searchParams.SearchText



      const promiseArticles = axios.get<{articles : Iarticle[], pages : number}>(`https://myawesomeapp.me/api/articles`, { params: finalSearchParams }  );
      const data = await promiseArticles
      // const data = await CheckApi(promiseArticles)
      setArticles(data.data.articles);  
      setPageCount(data.data.pages);
      

    };

    fetchData().then(() => {setisLoading(false);});
    
  }, [searchParams]);


  useEffect(() => {
    let queryString = "?";
    for (const [key, value] of Object.entries(searchParams)) {
        if (value) {

            if  (!(key == 'SortProperty' && value == '-date') && !(key == 'page' && value == '1')) queryString += `${key}=${value}&`;
        }
    }
    queryString = queryString.slice(0, -1);


    navigate(queryString);

  }, [searchParams])




  const handlePageClick = (selectedItem: {
    selected: number;
}) => {

  console.log('pase setted', selectedItem.selected + 1)
    dispatch(setPage(selectedItem.selected + 1));
  };


  


  return (
    <>
    <Search/>
    <div className="context">
      

      {
  isLoading 
  ?  
  <div className="row-articles">
    {[...new Array(8)].map( (_, index) => <Skeleton key = {index}/>  ) }
  </div>
  :
  articles.length !== 0 ?
  (
    <>
      <div className="row-articles">
        {articles.map((article) => (<ArticleCart key={article.id} article={article}/>))}
      </div>
      <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      onPageChange={handlePageClick}
      forcePage = {searchParams.page - 1}
      pageRangeDisplayed={5}
      pageCount={pageCount? pageCount : 0}
      previousLabel="< previous"
      // renderOnZeroPageCount={null}
      />
      </>
  ):
  (
    <div className="row-articles">
      <div className='no-fav'>Cant find anything by this parameters</div>
    </div>


  )
}

    </div>

    



    </>
  )
}

export default RowArticles