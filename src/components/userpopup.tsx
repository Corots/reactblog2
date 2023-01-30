import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import guy from '../assets/img/guy.jpg';
import bookmark from '../assets/bookmark.svg';


type Props = {}

const Userpopup = (props: Props) => {


    
  return (
    <>
                <img src={guy} className="avatar"></img>
                <div className="name">John Smith</div>
                <div className="occup">Author, redactor</div>

                <div className="menu-elems">
                    
                    <Link to="/article">
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">My articles</div>
                            <div className="number">2</div>
                        </div>
                    </Link>
                    
                        
                   

                    <a href="/template/mynotes.html">
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">My booknotes</div>
                            <div className="number">5</div>
                        </div>
                    </a>


                    <a href="#">
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">My comments</div>
                        </div>
                    </a>

                    <a href="#">
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">Settings</div>
                        </div>
                    </a>

                    <a href="#">
                        <div className="elem">
                            <img src={bookmark} className="logo" alt="image description"/>
                            <div className="text">Log out</div>
                        </div>
                    </a>

                </div>


    </>
  )
}

export default Userpopup