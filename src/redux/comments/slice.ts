import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommentSliceState, Sort, SortPropertyEnum } from './types';

const initialState: CommentSliceState = {
    SortProperty : SortPropertyEnum.POPULARITY
  };


  const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
      setCommentSort(state, action: PayloadAction<CommentSliceState>) {
        // const { text, author } = action.payload;
        state.SortProperty = action.payload.SortProperty
      },
    },
  });


export const { setCommentSort } = commentSlice.actions;

export default commentSlice.reducer;