import React, { useEffect, useState } from 'react'


import { useAppDispatch } from '../redux/store';
import { setSearch } from '../redux/filter/slice';

import { FilterSliceState, Sort, SortPropertyEnum } from '../redux/filter/types';


 


import arrow_down from '../assets/arrow-down.svg';
import { selectFilter } from '../redux/filter/selectors';
import { useSelector } from 'react-redux';
import qs from 'qs';



type Props = {}

type SortItem = {
  name: string;
  sortProperty: SortPropertyEnum;
};

export const sortList: SortItem[] = [
  { name: 'Sort by date (old first)', sortProperty:  SortPropertyEnum.DATE_ASC },
  { name: 'Sort by date (new first)', sortProperty:  SortPropertyEnum.DATE_DESC},
  { name: 'Sort by author (A -> Z)',  sortProperty:  SortPropertyEnum.AUTHOR_ASC},
  { name: 'Sort by author (Z -> A)',  sortProperty:  SortPropertyEnum.AUTHOR_DESC},
];








const Search  : React.FC = (props: Props) => {

  const dispatch = useAppDispatch();

  const searchParams = useSelector(selectFilter);

  const [openMenu, setopenMenu] = useState(false);
  const [inputText, setInputText] = useState(searchParams.SearchText);
  const [inputAuthor, setInputAuthor] = useState(searchParams.SearchAuthor);

  const sort = sortList.find(obj => obj.sortProperty === searchParams.SortProperty)
  const [sortType, setSortType] = useState<SortItem>(sort ? sort : sortList[0] );

  
  

  useEffect(() => {
    if (window.location.search){

      const params = window.location.search.substring(1);
      const result = qs.parse(params)

      if (typeof result.SearchText == 'string') setInputText(result.SearchText)
      if (typeof result.SearchAuthor == 'string') setInputAuthor(result.SearchAuthor)
      
      if (typeof result.SortProperty == 'string'){
        const sort = sortList.find(obj => obj.sortProperty.valueOf() === result.SortProperty)
          if (sort){
            setSortType(sort);
          }
      }

      

      };


    }
  , []);


  const clearInputs = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInputText('');
    setInputAuthor('');
    setSortType(sortList[0]);
  }



  const searchHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const searchState : FilterSliceState = {
      SearchText : inputText,
      SearchAuthor : inputAuthor,
      SortProperty : sortType.sortProperty
    };
    dispatch(setSearch(searchState));
  }

  const handleSort = (item: SortItem) => {
    setopenMenu(false);
    setSortType(item);
  }


  



  return (
    <div className="search">
        <form className="inputs">

            <input type="text" className="text search-input" placeholder="Enter text to search" value={inputText} onChange={e => setInputText(e.target.value)} />
            <input type="text" className="author search-input" placeholder="Enter author" value={inputAuthor} onChange={e => setInputAuthor(e.target.value)}/>


            <div className="search-input-wrapper">
              <div className="author search-input" onClick= {() => setopenMenu(!openMenu)} >{sortType.name} 
                <img src={arrow_down} alt="" className="arrow" />
              </div>


              {openMenu ? (
              
              <div className="popup-sort">
                {sortList.map((item) => (
                  <div className={`item ${item.name === sortType.name ? 'item-choosed' : ''}`} onClick = {() => handleSort(item)}>
                    {item.name}
                  </div>
                ))}
              </div>) : <></>}
              


            </div>
            


            <button className="search-button" onClick={searchHandler}>Search</button>
            <button className="search-button" onClick={clearInputs}>Clear</button>

        </form>
    </div>
  )
}

export default Search