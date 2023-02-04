import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import guy from '../../assets/img/guy.jpg';
import bookmark from '../../assets/bookmark.svg';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { favoriteFilter } from '../../redux/favorite/selectors';
import { useAppDispatch } from '../../redux/store';
import { set_unlogged } from '../../redux/favorite/slice';
import Avatar from '@mui/material/Avatar';
import { OptionProps } from '../header';

type PopupClick = MouseEvent & {
    path: Node[];
  };


const LoggedIn : React.FC<OptionProps>  = ({avatarRef, MenuVisible, setMenuVisible, setSelected }) => {

    const {idFavorites, idBookmarks, name} = useSelector(favoriteFilter);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();


    const handleLogout = () => {
        dispatch(set_unlogged());
        setMenuVisible(false);
    }

    // ! If click outside
    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && avatarRef.current && !wrapperRef.current.contains(event.target as Node) && !avatarRef.current.contains(event.target as Node)) {
            console.log('click outside!');
            setMenuVisible(false);
        }
      };

    useEffect(() => {
        document.body.addEventListener('click', handleClickOutside);
        return () => {
          document.body.removeEventListener('click', handleClickOutside);
        };
      }, []);




  if (!MenuVisible) return <></>
  return (

    
    <div className="account" ref={wrapperRef}>
                <Avatar className="avatar" alt = {name ? name[0].toUpperCase() + name.slice(1) : name}  src="/avatars/${name}" />
                {/* <img src={guy} className="avatar"></img> */}
                <div className="name">{name}</div>
                <div className="occup">Author, redactor</div>

                <div className="menu-elems">
                    
                    <Link to="/favorite">
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">My favorites</div>
                            {idFavorites.length ? <div className="number">{idFavorites.length}</div> : <></>}
                            {/* <div className="number">2</div> */}
                        </div>
                    </Link>
                    
                        
                   
                    <Link to="/bookmarks">
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">My booknotes</div>
                            {idBookmarks.length ? <div className="number">{idBookmarks.length}</div> : <></>}
                            {/* <div className="number">5</div> */}
                        </div>
                    </Link>


                   
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">My comments</div>
                        </div>
                

               
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">Settings</div>
                        </div>
              

    
                            <div className="elem elem-logout" onClick={handleLogout}>
                                <img src={bookmark} className="logo" alt="image description"/>
                                <div className="text">Log out</div>
                            </div>

                 

                </div>


    </div>
  )
}

export default LoggedIn;






