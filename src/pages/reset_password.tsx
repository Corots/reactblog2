import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React from 'react'
import { useLocation } from 'react-router-dom';
import preloader from '../assets/img/preloader.gif';




enum TypesResponseEnum{
    waiting = 0,
    badToken = 1,
    expToken = 2,
    formloaded = 3,
    waitForChange = 4,
    passChanged = 5,
}


const RestorePassword = () => {

    // Variable to handle response
    const [typeResponse, setTypeResponse] = React.useState<TypesResponseEnum>(TypesResponseEnum.waiting)
    const [message, setMessage] = React.useState<string>("1")


    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    
    
    // preload gif
    const [imagePreloader, setimagePreloader] = React.useState<HTMLImageElement>();

    React.useEffect(() => {
      const preloadImage = new Image();
      preloadImage.src = preloader;
      preloadImage.onload = () => setimagePreloader(preloadImage);
    }, []);


    // get info from link
    let location = useLocation();
    let queryParams = new URLSearchParams(location.search);
    let token = queryParams.get('token')?.toString();


    // get infoormation from api to check token
    React.useEffect(() => {
      const getCommentFromApi = async () => {
        try {
          if (token) {
            const { data } = await axios.get(`https://myawesomeapp.me/api/check_reset_token`, { params: { token } });
            // Do something with `data`
            setTypeResponse(TypesResponseEnum.formloaded)

          } else {
            setMessage("No token provided");
          }
        } catch (error: any) {
          if (error.isAxiosError && error.response?.status === 401) {
            setMessage("Token expired");
            setTypeResponse(TypesResponseEnum.expToken);
          } else if (error.isAxiosError && error.response?.status === 400) {
            setMessage("Wrong token");
            setTypeResponse(TypesResponseEnum.badToken);
          } else {
            // Handle other errors
          }
        }
      };
    
      getCommentFromApi();
    }, [token]);


    // Check if passwords are the same
    React.useEffect( () => {
      if (password !== confirmPassword && Boolean(password) && Boolean(confirmPassword)){
        setError('Passwords are not the same')
      }
      else{
        setError('')
      }
    }, [password, confirmPassword]  )



    // Send restore request for api
    const handleSubmitRestore =  async () => {
      try {
        if (token) {
          setIsLoading(true);
          const { data } = await axios.post(`https://myawesomeapp.me/api/reset_password`,  password , {params : {token : token}} );
          // Do something with `data`
          setTypeResponse(TypesResponseEnum.passChanged)
          setIsLoading(false);
        } else {
          setMessage("No token provided");
          
        }
      } 
      catch (error: any) {
        setIsLoading(false);
        if (error.isAxiosError && error.response?.status === 401) {
          setMessage("Token expired");
          setTypeResponse(TypesResponseEnum.expToken);
        } else if (error.isAxiosError && error.response?.status === 400) {
          setMessage("Wrong token");
          setTypeResponse(TypesResponseEnum.badToken);
        } else {
          // Handle other errors
        }
      }

    }



    // !Returns
    
    // Return for bad token
    if (typeResponse == TypesResponseEnum.badToken){
      return(
        <div className='no-fav'>
          Error 404 - No page found
        </div>
      )
    }

    // Return for expired token
    else if (typeResponse == TypesResponseEnum.expToken){
      return(
        <div className='no-fav'>
          Token is expired
        </div>
      )

    }

    // Return for Correct token
    else if (typeResponse == TypesResponseEnum.formloaded){
      return(
        <div className='restore-form'>

            {isLoading && <div id = 'preloader'><img src={imagePreloader ? imagePreloader.src : ""} alt="" /></div>}

            {/* display: flex;
            flex-direction: column;
            width: 30%;
            gap: 10px;
            padding: 20px 10px; */}


          Restore your password

          <TextField required 
            type="password" 
            size="small" 
            error = {Boolean(error)}     
            helperText= {error}    
            id="outlined-basic-reset" 
            label="Password" 
            variant="outlined" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            />

          <TextField required 
            type="password" 
            size="small" 
            error = {Boolean(error)} 
            helperText= {error}     
            id="outlined-basic-reset" 
            label="Confirm password" 
            variant="outlined" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            />

            <Button 
            
              variant="contained" 
              disableElevation color="success" 
              disabled = { !password || !confirmPassword || Boolean(error) } 
              onClick={handleSubmitRestore}
              >
                Restore Password
            </Button>

            {/* {error && <div>{error}</div>} */}


        </div>
      )

    }

    //  Wait for api response
    else if (typeResponse == TypesResponseEnum.waiting){
      return(
        <div className='no-fav'>
          waiting api response..
        </div>
      )

    }

    else if (typeResponse == TypesResponseEnum.passChanged){
      return(
        <div className='no-fav'>
          Congradilations! Password changed! Use your new password to log in
        </div>
      )

    }


  return (
    <div>Token : {token}
    Response : {typeResponse}
    Message : {message}
    </div>
  )


}

export default RestorePassword

