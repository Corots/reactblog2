import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { favoriteFilter } from "../../redux/favorite/selectors";
import LoggedIn from "./LoggedIn";
import NotLoggedIn from "./NotLoggedIn";



// const ArticleCart  : React.FC<{ article: Iarticle }> = ({ article }) => {

const LoginCheck: React.FC<{avatarRef: React.RefObject<HTMLDivElement> , menuVisible : boolean,  setMenuVisible :React.Dispatch<React.SetStateAction<boolean>> }>  = ({avatarRef, menuVisible, setMenuVisible }) => {
  const {logged} = useSelector(favoriteFilter);

  return (logged) ? <LoggedIn avatarRef= {avatarRef}  menuVisible = {menuVisible} setMenuVisible = {setMenuVisible} /> : <NotLoggedIn avatarRef= {avatarRef} MenuVisible = {menuVisible} setMenuVisible = {setMenuVisible}/>;
};


export default LoginCheck;