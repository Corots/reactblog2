import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterSliceState, Sort, SortPropertyEnum } from './types';

const initialState: FilterSliceState = {
    SearchText: '',
    SearchAuthor: '',
    SortProperty : SortPropertyEnum.DATE_ASC,
    page : 1,
  };


  const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
      setSearch(state, action: PayloadAction<FilterSliceState>) {
        // const { text, author } = action.payload;
        state.SearchText = action.payload.SearchText;
        state.SearchAuthor = action.payload.SearchAuthor;
        state.SortProperty = action.payload.SortProperty
      },

      setPage(state, action: PayloadAction<number>){
        state.page = action.payload
      }
    },
  });


export const { setSearch, setPage } = filterSlice.actions;

export default filterSlice.reducer;