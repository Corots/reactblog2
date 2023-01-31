import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteSliceState } from './types';


const getFromStorage = (item : string) =>{
  const data = localStorage.getItem(item)
  return data ? JSON.parse(data) : []
}

const initialState: FavoriteSliceState = {
  
      idFavorites : getFromStorage('favorites'),
      idBookmarks : getFromStorage('bookmarks'),
  };



const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {

    addFavorite(state, action: PayloadAction<string>){
      if(!state.idFavorites.includes(action.payload)){          //checking weather array contain the id
        state.idFavorites.push(action.payload);               //adding to array because value doesnt exists
      }else{
        state.idFavorites.splice(state.idFavorites.indexOf(action.payload), 1);  //deleting
      }

      localStorage.setItem('favorites', JSON.stringify(state.idFavorites));
    },

    addBookmark(state, action: PayloadAction<string>){
      if(!state.idBookmarks.includes(action.payload)){          //checking weather array contain the id
        state.idBookmarks.push(action.payload);               //adding to array because value doesnt exists
      }else{
        state.idBookmarks.splice(state.idBookmarks.indexOf(action.payload), 1);  //deleting
      }

      localStorage.setItem('bookmarks', JSON.stringify(state.idBookmarks));
    },

    
  },
});


export const { addFavorite, addBookmark } = favoriteSlice.actions;

export default favoriteSlice.reducer;