import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterSliceState, Sort, SortPropertyEnum } from './types';

const initialState: FilterSliceState = {
    SearchText: '',
    SearchAuthor: '',
    SortProperty : SortPropertyEnum.DATE_ASC
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
    },
  });


export const { setSearch } = filterSlice.actions;

export default filterSlice.reducer;