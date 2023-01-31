import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import guy from '../assets/img/guy.jpg';
import bookmark from '../assets/bookmark.svg';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { favoriteFilter } from '../redux/favorite/selectors';


type Props = {}

const Userpopup = (props: Props) => {

    const {idFavorites, idBookmarks} = useSelector(favoriteFilter);
    
  return (
    <>
                <img src={guy} className="avatar"></img>
                <div className="name">John Smith</div>
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
              

                
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">Log out</div>
                        </div>
                 

                </div>


    </>
  )
}

export default Userpopup