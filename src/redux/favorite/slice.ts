import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { FavoriteSliceState, ILoginInfo } from './types';


const getFromStorage = (item : string) =>{
  const data = localStorage.getItem(item)
  return data ? JSON.parse(data) : []
}






const initialState: FavoriteSliceState = {
      logged : false,
      idFavorites : getFromStorage('favorites'),
      idBookmarks : getFromStorage('bookmarks'),
  };



const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {

    set_logged(state, action : PayloadAction<FavoriteSliceState>){
        state.logged  = action.payload.logged
        state.idBookmarks = action.payload.idBookmarks
        state.idFavorites = action.payload.idFavorites
        state.img = action.payload.img
        state.name = action.payload.name
    },

    set_unlogged(state){
      state.logged = false
      state.name = undefined
      state.img = undefined
      state.idFavorites = []
      state.idBookmarks = []
      localStorage.clear()
    },



    addFavorite(state, action: PayloadAction<number>){
      if(!state.idFavorites.includes(action.payload)){          //checking weather array contain the id
        state.idFavorites.push(action.payload);

        const access_token = localStorage.getItem('access_token');
        if (state.logged && access_token){
          axios.post(`https://myawesomeapp.me/api/article/${action.payload}/favorite?token=${access_token}`)
        }
        else{
          localStorage.setItem('favorites', JSON.stringify(state.idFavorites));
        }

        

        
        //adding to array because value doesnt exists
      }else{
        state.idFavorites.splice(state.idFavorites.indexOf(action.payload), 1);  //deleting

        const access_token = localStorage.getItem('access_token');
        if (state.logged && access_token){
          axios.delete(`https://myawesomeapp.me/api/article/${action.payload}/favorite?token=${access_token}`)
        }
        else{
          localStorage.setItem('favorites', JSON.stringify(state.idFavorites));
        }

      }



    },

    refreshFavorites(state, action: PayloadAction<number[]>){
      state.idFavorites = action.payload
    },

    refreshBookmark(state, action: PayloadAction<number[]>){
      state.idBookmarks = action.payload
    },


    addBookmark(state, action: PayloadAction<number>){
      if(!state.idBookmarks.includes(action.payload)){          //checking weather array contain the id
        state.idBookmarks.push(action.payload);

        const access_token = localStorage.getItem('access_token');
        if (state.logged && access_token){
          axios.post(`https://myawesomeapp.me/api/article/${action.payload}/bookmark?token=${access_token}`)
        }
        else{
          localStorage.setItem('bookmarks', JSON.stringify(state.idBookmarks));
        }

      }else{
        state.idBookmarks.splice(state.idBookmarks.indexOf(action.payload), 1);  //deleting

        const access_token = localStorage.getItem('access_token');
        if (state.logged && access_token){
          axios.delete(`https://myawesomeapp.me/api/article/${action.payload}/bookmark?token=${access_token}`)
        }
        else{
          localStorage.setItem('bookmarks', JSON.stringify(state.idBookmarks));
        }
      }

    },

    
  },
});


export const { addFavorite, addBookmark, refreshFavorites, refreshBookmark, set_logged, set_unlogged } = favoriteSlice.actions;

export default favoriteSlice.reducer;