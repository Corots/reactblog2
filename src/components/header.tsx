import React, { useEffect, useRef, useState } from 'react'

import guy from '../assets/img/guy.jpg';
import bookmark from '../assets/bookmark.svg';
import profile from '../assets/profile.svg';
import { Link } from 'react-router-dom';
import Userpopup from './Login/LoggedIn';
import Avatar from '@mui/material/Avatar';
import Favorite from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Badge from '@mui/material/Badge';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { favoriteFilter } from '../redux/favorite/selectors';
import NotLoggedIn from './Login/NotLoggedIn';
import LoginCheck from './Login/LoginCheck';
import LoggedIn from './Login/LoggedIn';
import Register from './Login/Register';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

type Props = {}

export interface OptionProps {
    avatarRef: React.RefObject<HTMLDivElement>;
    MenuVisible: boolean;
    setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>
    setSelected: React.Dispatch<React.SetStateAction<number>>
  }

const Header  : React.FC = (props: Props) => {

    const popupMenuRef = useRef<HTMLDivElement>(null);

    const [menuVisible, setMenuVisible] = useState(false);
    const avatarRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(0)

    const {idFavorites, idBookmarks, name, logged} = useSelector(favoriteFilter);

    
    const [headerAppear, setHeaderAppear] = useState(true)
    const [lastScroll, setLastScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            if (lastScroll  < currentScroll && currentScroll > 102){
                setHeaderAppear(false)

                menuVisible && setMenuVisible(false)

            }
            else {
                setHeaderAppear(true) 
            }

            setLastScroll(currentScroll);
        };

    
        window.addEventListener("scroll", handleScroll);



        

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [lastScroll])

    const onClose =() => {
        setMenuVisible(false);
      }

      


    // useEffect(() => {
    // const handleClickOutside = (event: MouseEvent) => {
    //     if (popupMenuRef.current && !popupMenuRef.current.contains(event.target as Node)) {
    //     onClose();
    //     }
    // };
    // document.addEventListener('mouseup', handleClickOutside);
    // return () => {
    //     document.removeEventListener('mouseup', handleClickOutside);
    // };
    // }, [onClose]);


    const handleAvatarClick = () => {
        setMenuVisible(!menuVisible)
    }


    
  return (
    <div className={headerAppear ? "header" : "header header-hidden"}>
        
        <Link to="/">
            <div className="text">AwesomeBlog</div>
        </Link>


        <div className="control">

            {/* ! Check if menu visible. If yes - show a component which choose the popup menu */}
            {menuVisible && (

            logged ? 
            <LoggedIn avatarRef= {avatarRef}  MenuVisible = {menuVisible} setMenuVisible = {setMenuVisible} setSelected = {setSelected}  /> 
            :    
            <NotLoggedIn avatarRef= {avatarRef} MenuVisible = {menuVisible} setMenuVisible = {setMenuVisible} setSelected = {setSelected} /> 
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
            

            {/* <div className='clickable'> */}
                {/* ! Check if user logged. Choose the avatar depends on it.  */}    
                {/* If person click the avatar - change the status of menu showing (True/false) */}
                {/* <Avatar onClick={handleAvatarClick} alt = {name ? name[0].toUpperCase() + name.slice(1) : name}  src={logged ? "/avatars/${name}" : "" } ref={avatarRef} /> 
            </div> */}
            
            <Tooltip title={logged ? "Account settings" : "Login/Register"}>
                    <IconButton
                        onClick={handleAvatarClick}
                        size="small"
                        sx={{ ml: 2 }}
                    >
                        <Avatar ref={avatarRef} src={logged ? "/avatars/${name}" : ""} sx={{ width: 32, height: 32 }}>{name ? name[0].toUpperCase() : name}</Avatar>
                    </IconButton>
            </Tooltip>

            
        </div>
    </div>
  )
}

export default Header