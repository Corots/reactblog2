import React, { useEffect, useRef, useState } from 'react'

import guy from '../assets/img/guy.jpg';
import bookmark from '../assets/bookmark.svg';
import profile from '../assets/profile.svg';
import { Link } from 'react-router-dom';
import Userpopup from './userpopup';
import Avatar from '@mui/material/Avatar';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Badge from '@mui/material/Badge';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { favoriteFilter } from '../redux/favorite/selectors';


type Props = {}


const Header  : React.FC = (props: Props) => {

    const popupMenuRef = useRef<HTMLDivElement>(null);
    const [menuVisible, setMenuVisible] = useState(false);


    const {idFavorites, idBookmarks} = useSelector(favoriteFilter);
    

    const onClose =() => {
        setMenuVisible(false);
      }


    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (popupMenuRef.current && !popupMenuRef.current.contains(event.target as Node)) {
        onClose();
        }
    };
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
        document.removeEventListener('mouseup', handleClickOutside);
    };
    }, [onClose]);



  return (
    <div className="header">
        
        <Link to="/">
            <div className="text">AwesomeBlog</div>
        </Link>


        <div className="control">

            {/* <div className="fav">
                <img src={bookmark} className="icon" alt="image description"/>

                <div className="number">
                    <div className="eclispe"></div>
                    <div className="digit">2</div>
                </div>
            </div> */}


            {menuVisible && (
                <div className="account" ref={popupMenuRef}>
                    <Userpopup/>
                </div>
                
            )}

            <Link to={`/favorite`}>
                <div className='clickable'>
                    <Badge badgeContent={idFavorites.length} color="secondary">
                        <Favorite color='primary' />
                    </Badge>
                </div>
            </Link>
            
            <Link to={`/bookmarks`}>
                <div className='clickable'>
                    <Badge badgeContent={idBookmarks.length} color="secondary">
                        <BookmarkIcon color='primary' />
                    </Badge>
                </div>
            </Link>
            

            <div className='clickable'>
                <Avatar onClick={() => setMenuVisible(!menuVisible)}/>
            </div>


            {/* <div className="login-frame">
                <form>
                    <input type="text" id="username" name="username" className="login" placeholder="Enter your username"/>
                    <input type="password" id="password" name="password" className="password"
                        placeholder="Enter your password"/>
                    <button type="submit" className="button-login">Login</button>
                </form>

                <div className="DontHaveAccFrame">
                    <div className="left-text">Dont have an account?</div>
                    <a href="register.html" className="right-text">Register</a>
                </div>

                <div className="ForgetPassFrame">
                    <div className="left-text">Lost your password?</div>
                    <a href="restorepass.html" className="right-text">Restore password</a>
                </div>
            </div> */}

            
        </div>
    </div>
  )
}

export default Header