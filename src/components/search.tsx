import React, { useEffect, useState } from 'react'


import { useAppDispatch } from '../redux/store';
import { setPage, setSearch } from '../redux/filter/slice';

import { FilterSliceState, Sort, SortPropertyEnum } from '../redux/filter/types';


 


import arrow_down from '../assets/arrow-down.svg';
import { selectFilter } from '../redux/filter/selectors';
import { useSelector } from 'react-redux';
import qs from 'qs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';



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

      if (Number(result.page)){
        dispatch(setPage(Number(result.page)))
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
      SortProperty : sortType.sortProperty,
      page : 1,
    };
    dispatch(setSearch(searchState));
  }

  const handleSort = (item: SortItem) => {
    setopenMenu(false);

    setSortType(item);

  }


  

  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const labelStyle = { position : "absolute", top : -3}


  return (
    <div className="search">
        <form className="inputs">



            <TextField size="small"  id="outlined-basic" label="Enter text to search" variant="outlined" value={inputText} onChange={e => setInputText(e.target.value)} />
            <TextField size="small"  id="outlined-basic" label="Enter author" variant="outlined" value={inputAuthor} onChange={e => setInputAuthor(e.target.value)} />

            <FormControl size="small">
              <InputLabel id="demo-simple-select-label" sx = {labelStyle} >Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Sort By"
                onChange={handleChange}
              >
                {sortList.map((item) => (
                  <MenuItem value={item.name} onClick = {() => handleSort(item)}>{item.name}</MenuItem>
              ))}
              </Select>
            </FormControl>








                  

            {/* </div> */}
            

            <Button fullWidth variant="contained" onClick={searchHandler}>Search</Button>
            <Button fullWidth variant="outlined" onClick={clearInputs}>Clear</Button>
            {/* <button className="search-button" onClick={searchHandler}>Search</button> */}
            {/* <button className="search-button" onClick={clearInputs}>Clear</button> */}

        </form>
    </div>
  )
}

export default Search