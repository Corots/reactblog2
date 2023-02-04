import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { favoriteFilter } from "../../redux/favorite/selectors";
import { OptionProps } from "../header";
import LoggedIn from "./LoggedIn";
import NotLoggedIn from "./NotLoggedIn";
import Register from "./Register";






const LoginCheck: React.FC<{children: React.ReactElement<OptionProps>[], menuVisible: boolean, selected : number  }>  = ({children, menuVisible, selected}) => {
  const {logged} = useSelector(favoriteFilter);

  console.log('is menu visible', menuVisible)




  return(<>
  {React.cloneElement(children[selected])}</>)

  

};


export default LoginCheck;