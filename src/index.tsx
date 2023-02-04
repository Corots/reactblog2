import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { refreshFavorites, refreshBookmark, set_logged } from './redux/favorite/slice';
 import { IUserInfo } from './redux/favorite/types';


const container = document.getElementById('root')!;
const root = createRoot(container);





const access_token = localStorage.getItem('access_token')

if (access_token){
  console.log('token exist');

  const updateParams = () => {
      axios.get<IUserInfo>('https://myawesomeapp.me/api/user', {params : {token : access_token}})
    .then(res => {
      const data = res.data;
      store.dispatch(set_logged({logged : true, img : data.img, 
        idFavorites : data.idFavorites, 
        idBookmarks : data.idBookmarks,
        name : data.username,
      }));
        
    })
    .catch(err => {
      console.error(err);
    });
  }
  window.onload = function() {
    updateParams();
  };
  
  
}
else{
  console.log('token doesnt exist');
}







root.render(

    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
