import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { set_logged } from "../../redux/favorite/slice";
import { IUserInfo } from "../../redux/favorite/types";
import { useAppDispatch } from "../../redux/store";
import { OptionProps } from "../header";
import preloader from '../../assets/img/preloader.gif';
import {styled } from "@mui/material/styles";


import {makeStyles}  from '@material-ui/core/styles'

import FormControl, { useFormControl } from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { Link } from "react-router-dom";






export interface ILoginResponse {
  success: boolean;
  access_token?: string;
  refresh_token? : string;
  message?: string;

  userdata? : IUserInfo
}



enum PageChoose{
  login = 1,
  register = 2,
  forgot = 3
}

  
  



const NotLoggedIn: React.FC<OptionProps>  = ({avatarRef, MenuVisible, setMenuVisible, setSelected }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [emailRestore, setemailRestore] = useState("");
  const [loginlRestore, setloginlRestore] = useState("");


  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [ChoosenBlock, setChoosenBlock] = useState<PageChoose>(PageChoose.login);
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState<string | undefined>(undefined);
  const [LoginError, setLoginError] = useState<string | undefined>(undefined);
  const [PasswordError, setPasswordError] = useState<string | undefined>(undefined);
  const [ConfPasswordError, setConfPasswordError] = useState<string | undefined>(undefined);
  const [EmailError, setEmailError] = useState<string | undefined>(undefined);


  const [loginlRestoreError, setloginlRestoreError] = useState<string | undefined>(undefined);
  const [emailRestoreError, setemailRestoreError] = useState<string | undefined>(undefined);


  const [LoginChecked, setLoginChecked] = useState<boolean>(true);


  const [link, setLink] = useState("")
  
  
  const wrapperNotloggedRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();


  const clearErrors =() => {
    setError(undefined)
    setLoginError(undefined)
    setPasswordError(undefined)
    setConfPasswordError(undefined)
    setEmailError(undefined)
    setloginlRestoreError(undefined)
    setemailRestoreError(undefined)
  }

  const clearData =() => {
    setUsername("")
    setPassword("")
    setConfPassword("")
    setEmail("")
    setemailRestore("")
    setloginlRestore("")
  }


  useEffect(() => {
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId as NodeJS.Timeout);
      }
    };
  }, [timeoutId]);



  

  // ! handle submit login
  const handleSubmitLogin = async () => {
    
    if (!username || !password){
      setError("Login and/or password fields can't be empty");
      return
    }
    clearErrors()
    setLoading(true)

    try {
      
      const response = await axios.post<ILoginResponse>("https://myawesomeapp.me/api/login", {
        username,
        password,
      });
      setLoading(false);

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
      setLoading(false);
      setError("An unknown error occurred!");
      console.log(err)
    }
  };

  // ! Handle submit Register
  const handleSubmitRegister = async () => {
    
    if (!username || !password){
      setLoginError("Login and/or password fields can't be empty");
      setPasswordError("Login and/or password fields can't be empty");
      return
    }
    if (password !== confPassword){
      setError("Password and confirm password aren't the same");
      setPassword("");
      setConfPassword("");
      return
    }


    clearErrors()
    setLoading(true)

    try {
      const response = await axios.post<ILoginResponse>("https://myawesomeapp.me/api/add_user", {
        username,
        password,
        'email' : Email,
      });

      const data : ILoginResponse = response.data
      setLoading(false);

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

      

    } catch (error: any) {
      setLoading(false);

      if (error.isAxiosError && error.response?.status === 402) {
        setError("Login already exist!")
      }
      else{
        setError("An unknown error occurred!");
      }
      console.log(error)

    }
  };


  // ! Handle submit Forgot
  const handleSubmitForgot = async () => {
    clearErrors()
    setLoading(true)


    console.log('inside restore method!')

    try {

      console.log('choosenRestoreOptions', choosenRestoreOptions)
      if (choosenRestoreOptions == choosenRestoreOptionEnum.username){
        const response = await axios.get("https://myawesomeapp.me/api/reset_password", {  params : {"username" : loginlRestore}  });
        setLoading(false);
        setLink(response.data.message);
        console.log('success!', response.data.message)
      }
      else if (choosenRestoreOptions == choosenRestoreOptionEnum.email){
        const response = await axios.get("https://myawesomeapp.me/api/reset_password", {  params : {"email" : emailRestore}  });
        setLoading(false);
        setLink(response.data.message);
        console.log('success!!',response.data.message );
      }

        



    } catch (error: any) {
      setLoading(false);

      if (error.isAxiosError && error.response?.status === 410) {
        console.log('no such login')
      }

      else if (error.isAxiosError && error.response?.status === 411) {
        console.log('no such email')
      }
      else if (error.isAxiosError && error.response?.status === 429) {
        console.log('too many tries')
      }

       
    

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


  const handleLoginBlockVisibility = (check : PageChoose) => {
    setChoosenBlock(check) ;
    clearErrors();
    clearData();
  }


  // ! Check for username every second
  const handleUsernameInputRegister = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLoginChecked(false);

    if (timeoutId !== null) {
      clearTimeout(timeoutId as NodeJS.Timeout);
    }
    const varName = e.target.value

    setUsername(varName);
    if (varName == ""){
      setLoginError(undefined);
      return
    }

    const newTimeoutId = setTimeout(async () => {
      try {
        const response = await axios.get(
          `https://myawesomeapp.me/api/check_user/${varName}`
        );
        setLoginError(undefined);
        setLoginChecked(true);



      } catch (error : any) {
        if (error.isAxiosError && error.response?.status === 402) {
          setLoginChecked(false);
          setLoginError("Login already exists!");
        }
      }
    }, 1000);
    setTimeoutId(newTimeoutId);
  };



  // ! Check for passwords
  const handlePasswordInputRegister = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setPassFunc : React.Dispatch<React.SetStateAction<string>>) => {
    const tempPass = e.target.value
    setPassFunc(tempPass)
  }


  React.useEffect(() => {

    if (confPassword !== password){
      const errorText = 'Passwords are not equal';
      setPasswordError(errorText);
      setConfPasswordError(errorText);
      console.log('passwords arent equal!', password, confPassword);
    }
    else{
      setPasswordError(undefined);
      setConfPasswordError(undefined);
      console.log('passwords are equal!', password, confPassword)
    }




  }, [confPassword, password])


  // ! Preload gif

  const [imagePreloader, setimagePreloader] = useState<HTMLImageElement>();

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = preloader;
    preloadImage.onload = () => setimagePreloader(preloadImage);
  }, []);




  // 
  const helperLogin = () => {    
    if (LoginError) return LoginError
    if (LoginChecked && username) return 'username is free'
  }





  React.useEffect(() => {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (Email !== "" && !emailRegex.test(Email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError(undefined);
    }

    if (emailRestore !== "" && !emailRegex.test(emailRestore)) {
      setemailRestoreError("Invalid email address");
    } else {
      setemailRestoreError(undefined);
    }



  }, [Email, emailRestore])


  enum choosenRestoreOptionEnum{
      email = "email",
      username = "username"
    }

  const [choosenRestoreOptions, setchoosenRestoreOptions] = React.useState(choosenRestoreOptionEnum.email.valueOf());

  



  const handleChooseRestoreOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setchoosenRestoreOptions((event.target as HTMLInputElement).value);
  };



  const changeRestoreData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (choosenRestoreOptions == choosenRestoreOptionEnum.email){
      setemailRestore(e.target.value)
    }
    else if (choosenRestoreOptions == choosenRestoreOptionEnum.username){
      setloginlRestore(e.target.value)
    }
  }


  const getRestoreValue = () => {
    if (choosenRestoreOptions == choosenRestoreOptionEnum.email){
      return emailRestore
    }
    else if (choosenRestoreOptions == choosenRestoreOptionEnum.username){
      return loginlRestore
    }
  }

  const getDisablilityButtonRestore =() =>{
    console.log('button visibility method. Email error is ', emailRestoreError)
    if (choosenRestoreOptions == choosenRestoreOptionEnum.email && emailRestore && !emailRestoreError){

      console.log(emailRestoreError)
      return false
    }
    else if (choosenRestoreOptions == choosenRestoreOptionEnum.username && loginlRestore){
      return false
    }
    return true
  }






  if (ChoosenBlock === PageChoose.login){
    return(
    
    <div className="login-frame" ref = {wrapperNotloggedRef}>
    {/* <form onSubmit={handleSubmit}> */}

    {loading && <div id = 'preloader'><img src={imagePreloader ? imagePreloader.src : ""} alt="" /></div>}
    <form>
        <TextField size="small"  id="outlined-basic" error = {!!error}   label="Username" variant="outlined" value={username} onChange={e => setUsername(e.target.value)} helperText= {error} />
        <TextField type="password" size="small" error = {!!error}   id="outlined-basic" label="Password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} helperText= {error} />
        <Button disabled={!username || !password} variant="contained" disableElevation onClick={handleSubmitLogin}>Login</Button>
    </form>

    <div className="ForgetPassFrame">
        <div className="left-text">Lost your password?</div>
        <div className="left-text left-text-clickable" onClick={() => handleLoginBlockVisibility(PageChoose.forgot)}>Restore password</div>
    </div>

    <div className="DontHaveAccFrame">
        <div className="left-text">Dont have an account?</div>
        <div className="left-text left-text-clickable" onClick = {() => handleLoginBlockVisibility(PageChoose.register)}>Register</div>
    </div>

    {error && <p className="Error">{error}</p>}
</div>)
  }

  else if (ChoosenBlock === PageChoose.register){
    return(
      <div className="login-frame" ref = {wrapperNotloggedRef}>
        {loading && <div id = 'preloader'><img src={preloader} alt="" /></div>}
        <form>
          
            <TextField 
              size="small" 
              variant="outlined" 
              value={username} 
              onChange={handleUsernameInputRegister} 
              error = {Boolean(LoginError)} 
              helperText= {helperLogin()}  
              label="Username" 
              required
              // color={(username) ? (!LoginError) ? "success" : "secondary": undefined}  
              // id="outlined-basic"  
              />
         


            <TextField required type="password" size="small" error = {Boolean(PasswordError)}     helperText= {PasswordError}    id="outlined-basic3" label="Password" variant="outlined" value={password} onChange={e => handlePasswordInputRegister(e, setPassword)} />
            <TextField required type="password" size="small" error = {Boolean(ConfPasswordError)} helperText= {ConfPasswordError}     id="outlined-basic4" label="Confirm password" variant="outlined" value={confPassword} onChange={e => handlePasswordInputRegister(e, setConfPassword)} />
            <TextField required  size="small" error = {Boolean(EmailError)} helperText= {EmailError}     id="outlined-basic4" label="Email" variant="outlined" value={Email} onChange={e => handlePasswordInputRegister(e, setEmail)} />
            <div className="DontHaveAccFrame"><div className="left-text">* Required fileds</div></div>
            <Button 
            
              variant="contained" 
              disableElevation color="success" 
              disabled = { !LoginChecked || !username || !password || !confPassword || !Email ||  LoginError !== undefined || PasswordError !== undefined || ConfPasswordError !== undefined || EmailError !== undefined } 
              onClick={handleSubmitRegister}>
                Register
            </Button>
        </form>
        
        <div className="ForgetPassFrame">
            <div className="left-text">Lost your password?</div>
            <div className="left-text left-text-clickable" onClick={() => handleLoginBlockVisibility(PageChoose.forgot) }>Restore password</div>
        </div>

        <div className="DontHaveAccFrame">
          <div className="left-text">Already have an account?</div>
          <div className="left-text left-text-clickable" onClick={() => handleLoginBlockVisibility(PageChoose.login) }>Log in</div>
        </div>


        {error && <p className="Error">{error}</p>}
    </div>
    )
  }


  else if (ChoosenBlock === PageChoose.forgot){
    return(
      <div className="login-frame" ref = {wrapperNotloggedRef}>
        {loading && <div id = 'preloader'><img src={preloader} alt="" /></div>}
        <form>
            <TextField required  size="small" error = {Boolean(EmailError)} helperText= {EmailError}     id="outlined-basic4" label={choosenRestoreOptions} variant="outlined" value={getRestoreValue()} onChange={changeRestoreData} />
            <div className="DontHaveAccFrame"><div className="left-text">* Required fileds</div></div>
            

        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">How do you want to restore password?</FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={choosenRestoreOptions}
            onChange={handleChooseRestoreOption}
          >
              <FormControlLabel value={choosenRestoreOptionEnum.email.valueOf()} control={<Radio />} label={choosenRestoreOptionEnum.email.valueOf()} />
              <FormControlLabel value={choosenRestoreOptionEnum.username.valueOf()}  control={<Radio />} label={choosenRestoreOptionEnum.username.valueOf()} />
          </RadioGroup>
        </FormControl>
            
            
            
            <Button 
            
              variant="contained" 
              disableElevation color="success" 
              disabled = {getDisablilityButtonRestore()} 
              onClick={handleSubmitForgot}>
                Restore
            </Button>
        </form>


      
        
        <div className="DontHaveAccFrame">
          <div className="left-text">Dont have an account?</div>
          <div className="left-text left-text-clickable" onClick = {() => handleLoginBlockVisibility(PageChoose.register)}>Register</div>
        </div>

        <div className="DontHaveAccFrame">
          <div className="left-text">Already have an account?</div>
          <div className="left-text left-text-clickable" onClick={() => handleLoginBlockVisibility(PageChoose.login) }>Log in</div>
        </div>


        {error && <p className="Error">{error}</p>}

        {link && <p> Your <Link to = {link}> link </Link> to restore password : </p>  }
    </div>

    )
  }

  else{
    return (<></>)
  }



}



  

export default NotLoggedIn