import axios from "axios";
import React, { useRef, useState } from "react";
import { set_logged } from "../../redux/favorite/slice";
import { IUserInfo } from "../../redux/favorite/types";
import { useAppDispatch } from "../../redux/store";




interface ILoginResponse {
  success: boolean;
  access_token?: string;
  message?: string;

  userdata? : IUserInfo
}

const NotLoggedIn: React.FC<{avatarRef: React.RefObject<HTMLDivElement>, MenuVisible : boolean,  setMenuVisible :React.Dispatch<React.SetStateAction<boolean>> }>  = ({avatarRef, MenuVisible, setMenuVisible }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const wrapperNotloggedRef = useRef<HTMLDivElement>(null);

  // const [IsVisible, setIsVisible] = useState(true);

  const [error, setError] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
         if(data.access_token){
          
            // ! Add token to a local storage and clear in before
            localStorage.clear();
            localStorage.setItem('access_token', data.access_token);

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


  // ! If click outside
  const handleClickOutside = (event: MouseEvent) => {
    if ( wrapperNotloggedRef.current && avatarRef.current &&  !avatarRef.current.contains(event.target as Node) &&  !wrapperNotloggedRef.current.contains(event.target as Node)   ) {
        setMenuVisible(false);
    }

  };

  React.useEffect(() => {
      document.body.addEventListener('click', handleClickOutside);
      return () => {
        document.body.removeEventListener('click', handleClickOutside);
      };
    }, []);


  return (
    <div className="login-frame" ref = {wrapperNotloggedRef}>
        <form onSubmit={handleSubmit}>
            <input type="text" id="username" name="username" className="login" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" id="password" name="password" className="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit" className="button-login">Login</button>
        </form>

        <div className="DontHaveAccFrame">
            <div className="left-text">Dont have an account?</div>
            <div className="left-text">Register</div>
        </div>

        <div className="ForgetPassFrame">
            <div className="left-text">Lost your password?</div>
            <div className="left-text">Restore password</div>
        </div>

        {error && <p className="Error">{error}</p>}
    </div>
  );
}
  

export default NotLoggedIn