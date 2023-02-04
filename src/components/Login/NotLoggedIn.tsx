import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useRef, useState } from "react";
import { set_logged } from "../../redux/favorite/slice";
import { IUserInfo } from "../../redux/favorite/types";
import { useAppDispatch } from "../../redux/store";
import { OptionProps } from "../header";
import Register from "./Register";




export interface ILoginResponse {
  success: boolean;
  access_token?: string;
  refresh_token? : string;
  message?: string;

  userdata? : IUserInfo
}

const NotLoggedIn: React.FC<OptionProps>  = ({avatarRef, MenuVisible, setMenuVisible, setSelected }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const wrapperNotloggedRef = useRef<HTMLDivElement>(null);

  const [IsLoginBlock, setIsLoginBlock] = useState(true);

  const [error, setError] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();


  

  const handleOpenRegister=  () => {
    console.log('start register')
    setSelected(1)
    // console.log('selected set to one')
    // console.log('Menu visible', MenuVisible)
  }
  
  // ! handle submit login
  const handleSubmitLogin = async () => {
    // e.preventDefault();

    setError(undefined);

    try {
      
      const response = await axios.post<ILoginResponse>("https://myawesomeapp.me/api/login", {
        username,
        password,
      });

      const data : ILoginResponse = response.data
      console.log(data)

      if (data.success){

          //  ! if token is here
         if(data.access_token && data.refresh_token){
          
            // ! Add token to a local storage and clear in before
            localStorage.clear();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            // ! Update data in redux
            if (data.userdata)
            {
              console.log('userdata exist!')
              dispatch(set_logged({logged : true, img : data.userdata.img, 
                idFavorites : data.userdata.idFavorites, 
                idBookmarks : data.userdata.idBookmarks,
                name : data.userdata.username,
              }));
            }

            // ! Close the popup 
            setMenuVisible(false);

         }else{
          
          setError("Error. Server doesnt return any token");
         } 
      }
      else{
        console.log('1 else!');
        data.message ? setError(data.message) : setError("An unknown error occurred");
        
      }

      

    } catch (err) {
      console.log('2 else!');
      setError("An unknown error occurred!");
      console.log(err)
    }
  };

  // ! Handle submit Register
  const handleSubmitRegister = async () => {
    setError(undefined);

    try {
      const response = await axios.post<ILoginResponse>("https://myawesomeapp.me/api/add_user", {
        username,
        password,
      });

      const data : ILoginResponse = response.data

      if (data.success){

          //  ! if token is here
         if(data.access_token && data.refresh_token){
          
            // ! Add token to a local storage and clear in before
            localStorage.clear();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            // ! Update data in redux
            if (data.userdata)
            {
              console.log('userdata exist!')
              dispatch(set_logged({logged : true, img : data.userdata.img, 
                idFavorites : data.userdata.idFavorites, 
                idBookmarks : data.userdata.idBookmarks,
                name : data.userdata.username,
              }));
            }

            // ! Close the popup 
            setMenuVisible(false);

         }else{
          
          setError("Error. Server doesnt return any token");
         } 
      }
      else{
        console.log('1 else!');
        data.message ? setError(data.message) : setError("An unknown error occurred");
      }

      

    } catch (err) {
      setError("An unknown error occurred!");
      console.log(err)
    }
  };


  // ! If click outside
  const handleClickOutside = (event: MouseEvent) => {
    if ( wrapperNotloggedRef.current && avatarRef.current &&  !avatarRef.current.contains(event.target as Node) &&  !wrapperNotloggedRef.current.contains(event.target as Node)   ) {
        setMenuVisible(false);
        console.log('click outside!');
    }

  };

  React.useEffect(() => {
      document.body.addEventListener('click', handleClickOutside);
      return () => {
        document.body.removeEventListener('click', handleClickOutside);
      };
    }, []);


  const handleLoginBlockVisibility = (check : boolean) => {
    setIsLoginBlock(check) ;
    setUsername("");
    setPassword("");
    setError("");
  }


  return (
    IsLoginBlock ? (<div className="login-frame" ref = {wrapperNotloggedRef}>
        {/* <form onSubmit={handleSubmit}> */}
        <form>
            <TextField size="small"  id="outlined-basic" error = {!!error}   label="Username" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField type="password" size="small" error = {!!error}   id="outlined-basic" label="Password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
            

            <Button variant="contained" disableElevation onClick={handleSubmitLogin}>Login</Button>
        </form>

        <div className="DontHaveAccFrame">
            <div className="left-text">Dont have an account?</div>
            <div className="left-text left-text-clickable" onClick = {() => handleLoginBlockVisibility(false)}>Register</div>
        </div>

        <div className="ForgetPassFrame">
            <div className="left-text">Lost your password?</div>
            <div className="left-text">Restore password</div>
        </div>

        {error && <p className="Error">{error}</p>}
    </div>
    ) 
    :
    (
      <div className="login-frame" ref = {wrapperNotloggedRef}>
        <form>
            <TextField size="small" error = {!!error}  id="outlined-basic"  label="Username" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField type="password" size="small" error = {!!error}  id="outlined-basic" label="Password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
            

            <Button variant="contained" disableElevation color="success" onClick={handleSubmitRegister}>Register</Button>
        </form>

        <div className="DontHaveAccFrame">
          <div className="left-text">Already have an account?</div>
          <div className="left-text left-text-clickable" onClick={() => handleLoginBlockVisibility(true) }>Log in</div>
        </div>

        <div className="ForgetPassFrame">
            <div className="left-text">Lost your password?</div>
            <div className="left-text">Restore password</div>
        </div>

        {error && <p className="Error">{error}</p>}
    </div>

    )
  );
}
  

export default NotLoggedIn