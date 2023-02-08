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
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon, {ListItemIconProps} from '@mui/material/ListItemIcon';
import SendIcon from '@mui/icons-material/Send';
import ListItemText from '@mui/material/ListItemText';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuItem from '@mui/material/MenuItem';
import { Logout } from '@mui/icons-material';

type PopupClick = MouseEvent & {
    path: Node[];
  };



const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    left: 119,
    top: 12,
  },
}));


const StyledList = styled(ListItemIcon)<ListItemIconProps>(({ theme }) => ({
    // '& .MuiListItemIcon-root ': {
    //   max-width: 30
    // },
    '& .css-cveggr-MuiListItemIcon-root': {
        minWidth: "39px",
        left : 100
      },
    }));


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


      const btnStyle = {width : '100%' , minHeight : '0' }
      const nameUpperCase = name ? name[0].toUpperCase() + name.slice(1) : name

  if (!MenuVisible) return <></>
  return (
    <div className="account" ref={wrapperRef}>

            <div className="user-top-info">

                <Avatar className="avatar" alt = {nameUpperCase}  src="/avatars/${name}" />


    
                {/* <img src={guy} className="avatar"></img> */}
                <div className="name">{nameUpperCase}</div>
                <div className="occup">Author, redactor</div>
            </div>

                <div className="menu-elems">
                    
                    {/* <Link to="/favorite">
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">My favorites</div>
                            {idFavorites.length ? <div className="number">{idFavorites.length}</div> : <></>}
                            <div className="number">2</div>
                        </div>
                    </Link>
                    
                        
                   
                   
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">My booknotes</div>
                            {idBookmarks.length ? <div className="number">{idBookmarks.length}</div> : <></>}
                            <div className="number">5</div>
                        </div> */}

                        
                        <Link to="/favorite">
                        <MenuItem sx = {btnStyle}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <StyledBadge badgeContent={idFavorites.length} color="secondary">
                                        My favorite
                                </StyledBadge>
                        </MenuItem>
                        </Link>
                        
                        <Link to="/bookmarks">
                            <MenuItem sx = {btnStyle}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                <StyledBadge badgeContent={idBookmarks.length} color="secondary">
                                            My booknotes
                                    </StyledBadge>
                            </MenuItem>
                        </Link>
                   
                
                        <MenuItem sx = {btnStyle}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                        My comments
                        </MenuItem>
               

                        <MenuItem sx = {btnStyle}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                        Settings
                        </MenuItem>


                        <MenuItem sx = {btnStyle} onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                        Logout
                        </MenuItem>
              
                </div>


    </div>
  )
}

export default LoggedIn;






