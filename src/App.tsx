import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';

import './style/style.css';
import Header from './components/header';
import Anouncment from './components/anouncment';

import RowArticles from './components/rowArticles';

import {Routes,Route} from "react-router-dom";
import ArticlePage from './pages/article';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Favorite from './components/favorite';
import Bookmarks from './components/bookmarks';
import ResetPassword from './pages/reset_password';


function App() {
  return (

    <>
    <Header/>
    <Anouncment/>
      <Routes>
        <Route path="/" element={<RowArticles />}  />
        <Route path="/article/:id" element={<ArticlePage />}  />
        <Route path="/favorite" element={<Favorite />}  />
        <Route path="/bookmarks" element={<Bookmarks />}  />
        <Route path="/reset_password" element={<ResetPassword />}  />
      </Routes>
    </>


    

    //  <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <Counter />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <span>
    //       <span>Learn </span>
    //       <a
    //         className="App-link"
    //         href="https://reactjs.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         React
    //       </a>
    //       <span>, </span>
    //       <a
    //         className="App-link"
    //         href="https://redux.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Redux
    //       </a>
    //       <span>, </span>
    //       <a
    //         className="App-link"
    //         href="https://redux-toolkit.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Redux Toolkit
    //       </a>
    //       ,<span> and </span>
    //       <a
    //         className="App-link"
    //         href="https://react-redux.js.org/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         React Redux
    //       </a>
    //     </span>
    //   </header>
    // </div> 
  );
}

export default App;
