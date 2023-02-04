import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

import guy from '../assets/img/guy.jpg';

import {Icomment, ISingleComment} from './comments'


import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import IconMenu from './MaterialUI/IconMenu';
import SaveIcon from '@mui/icons-material/Save';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { favoriteFilter } from '../redux/favorite/selectors';




type FontAwesomeSvgIconProps = {
    icon: any;
  };

const FontAwesomeSvgIcon = React.forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
    (props, ref) => {
      const { icon } = props;
  
      const {
        icon: [width, height, , , svgPathData],
      } = icon;
  
      return (
        <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
          {typeof svgPathData === 'string' ? (
            <path d={svgPathData} />
          ) : (
            /**
             * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
             * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
             * of a duotone icon. 40% is the default opacity.
             *
             * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
             */
            svgPathData.map((d: string, i: number) => (
              <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
            ))
          )}
        </SvgIcon>
      );
    },
  );



const Singlecomment : React.FC<ISingleComment> = ({ comment, replies, fetchData }) => {

    const popupRef = useRef<HTMLDivElement>(null);
    const [PopupOn, SetPopupOn] = useState(false);
    const [editing, setEditing] = useState(false);
    const [IsDeleteConfirm, setIsDeleteConfirm] = useState(false);
    
    
    const [IsReplying, setIsReplying] = useState(false);
    
    const [newComment, setnewComment] = useState(comment);

    const {logged, name} = useSelector(favoriteFilter);

    const defaultReply = {
        id: 1,
        text: '',
        reply_id: null,
        likes: 0,
        dislikes: 0,
        date : new Date().toString(),
        author: 'John Dada',
        author_id: 1,
        article_id : comment.article_id,
    }
    
    const [newReply, setnewReply] = useState<Icomment>(defaultReply);
     

    
    const handleEditClick = () => {
        setEditing(true);
        SetPopupOn(false);
      };

    

    const handleDelete = () => {
        setIsDeleteConfirm(window.confirm("Are you sure you want to delete this comment?"));
        SetPopupOn(false);
    };


    const HandleMenuClick = () =>{
        if (!PopupOn)
        {
            SetPopupOn(!PopupOn);
        }
        
    }


    useEffect(() => {
        const deleteReq = async () => {
            try {
                const query = {
                    token : localStorage.getItem("access_token"),
                }
                await axios.delete(`https://myawesomeapp.me/api/comment/${comment.id}`, {params : query}   );
            } catch (error) {
              console.log(error);
            } finally {
                console.log('deleted comment succesfully!');
                setIsDeleteConfirm(false);
            }
          };

        if (IsDeleteConfirm) {
            deleteReq().then(() => fetchData());
        }
      }, [IsDeleteConfirm]);

      const onClose =() => {
        SetPopupOn(false);
      }


      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (popupRef.current && !popupRef.current.contains(event.target as Node) && event.target !== popupRef.current){
            onClose();
          }
        };
        document.addEventListener('mouseup', handleClickOutside);
        return () => {
          document.removeEventListener('mouseup', handleClickOutside);
        };
      }, [onClose]);


    const getCommentFromApi = async () => {
        // Fetch the updated comments from the API
        const updatedComment = await axios.get(`https://myawesomeapp.me/api/comment/${comment.id}` );
        comment = updatedComment.data
        console.log('New comment from api is ', comment);
        setnewComment(comment);
    }


    


    const handleCancelClick = async () => {
        setEditing(false);
        await getCommentFromApi();
      };

    
      const handleStartReply = () => {
          setIsReplying(!IsReplying);

          if (IsReplying){
            setnewReply({ ...newReply, text: `@${newComment.id} `})
          }
          else{
            setnewReply(defaultReply);
          }
      }


      const CancelReplyHandler = () =>{
        setIsReplying(false);
      }

    


      const PostReplyHandler = async () => {
        try {
            const query = {
                token : localStorage.getItem("access_token"),
                reply_id : comment.reply_id || comment.id,
            }
            const body = {
                text : newReply.text,
                date : new Date().toISOString(),
            }
            const response = await axios.post(`https://myawesomeapp.me/api/article/${comment.article_id}/comment`, body, {params : query});
            setIsReplying(false);
            setnewReply(defaultReply);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };


      const updateComment = async (updatedComment : any) => {
            try {

                const query = {
                    token : localStorage.getItem("access_token")
                }

                const body = {
                    text : updatedComment.text,
                    date : new Date().toISOString(),
                }

                const response = await axios.put(`https://myawesomeapp.me/api/comment/${comment.id}`,body, {params : query} );
            } catch (error) {
                console.error(error);
            }
    
            setEditing(false);
            await getCommentFromApi();
      };


    const handleSaveClick = async () => {
    await updateComment({text: newComment.text})
    };

    const HandleLike = async () => {
        await updateComment({likes: newComment.likes + 1})
    };

    const HandleDisike = async () => {
        await updateComment({dislikes: newComment.dislikes + 1})
    };



    const [timeAgo, setTimeAgo] = useState<string>();
    useEffect(() => {
        const calculateTimeAgo = () => {
            const postedDate = new Date(comment.date);
            const currentDate = new Date();
            const differenceInMilliseconds = currentDate.getTime() - postedDate.getTime();
            let differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

            if (differenceInSeconds < 60) {
                setTimeAgo(`${differenceInSeconds} seconds ago`);
            } else {
                let differenceInMinutes = Math.floor(differenceInSeconds / 60);

                if (differenceInMinutes < 60) {
                    setTimeAgo(`${differenceInMinutes} minutes ago`);
                } else {
                    let differenceInHours = Math.floor(differenceInMinutes / 60);

                    if (differenceInHours < 24) {
                        setTimeAgo(`${differenceInHours} hours ago`);
                    } else {
                        let differenceInDays = Math.floor(differenceInHours / 24);

                        if (differenceInDays < 30) {
                            setTimeAgo(`${differenceInDays} days ago`);
                        } else {
                            let differenceInMonths = Math.floor(differenceInDays / 30);

                            if (differenceInMonths < 12) {
                                setTimeAgo(`${differenceInMonths} months ago`);
                            } else {
                                let differenceInYears = Math.floor(differenceInMonths / 12);
                                setTimeAgo(`${differenceInYears} years ago`);
                            }
                        }
                    }
                }
            }
        };

        calculateTimeAgo();
    }, [comment]);
    

    return (
        <>
            

            <div className={newComment.reply_id ? "comment comment-reply" : "comment"}>
            <div className="author-info">
                <div className="user">
                    {/* <img src={guy} className="author-image" /> */}

                   

                    <Avatar alt={newComment.author} src="sdf" />
                    <p>{newComment.author}</p>
                </div>
                <div className="eclispe-menu-wrapper">

                    {!editing && !IsReplying && logged && name == comment.author &&

                    <div>
                        {/* <div className="ellipse"></div>
                        <div className="ellipse"></div>
                        <div className="ellipse"></div> */}
                        <IconButton aria-label="Example" onClick={HandleMenuClick}>
                            <FontAwesomeSvgIcon  icon={faEllipsisV} />
                        </IconButton>
                    </div>
                    }
                    
                    {PopupOn && 
                    <div className="popup-users" ref={popupRef}>
                        <IconMenu handleEditClick = {handleEditClick} handleDelete = {handleDelete}/>
                    </div>
                    }



{/* https://mui.com/material-ui/icons/ */}


                </div>
            </div>

            {editing ? (
                <TextField
                    sx={{width : "100%"}}
                    id="outlined-multiline-static"
                    label="Comment text"
                    multiline
                    rows={8}
                    value={newComment.text} 
                    onChange={e => setnewComment({ ...newComment, text: e.target.value })} 
                /> 
            ) : 
            (
                <div className="text">
                    {newComment.text}
                </div>
            )}

        

            <div className="controlpanel">

                    {editing ?(
                        <div className="buttons-reaction">
                            {/* <button onClick={handleSaveClick}>Save</button>
                            <button onClick={handleCancelClick}>Cancel</button> */}
                            
                            <Button disabled={newComment.text === ''} variant="outlined" onClick={handleSaveClick} endIcon={<SaveIcon />}>Save</Button>
                            <Button variant="text" onClick={handleCancelClick}>Cancel</Button>


                        </div>
                    ):
                    (
                        <>
                        <div className="buttons-reaction">

                            <Button disabled color="success" variant="outlined" onClick={HandleLike} endIcon={<ThumbUpIcon />}>{newComment.likes}</Button>
                            <Button disabled color="error" variant="outlined" onClick={HandleDisike} endIcon={<ThumbUpIcon />}>{newComment.dislikes}</Button>
                        </div>
                        <div className="reply-button" onClick={handleStartReply}>Reply</div>
                        <div className="hours-ago">{timeAgo}</div>
                        </>
                    )}

              

                        
                

                
            </div>


            {IsReplying && (
                <>
                <TextField
                    sx={{width : "100%"}}
                    id="outlined-multiline-static"
                    label="Leave a reply"
                    multiline
                    rows={8}
                    defaultValue={`@${newComment.author[0].toUpperCase + newComment.author.slice(1)} `} 
                    onChange={e => setnewReply({ ...newReply, text: e.target.value, reply_id : newComment.reply_id || Number(comment.id) })}
                /> 
                
                <div className="controlpanel">
    
                        
                            <div className="buttons-reaction">
                                <Button disabled={newReply.text === ''} variant="outlined" onClick={PostReplyHandler} endIcon={<SendIcon />}>Post a reply</Button>
                                <Button variant="text" onClick={CancelReplyHandler}>Cancel</Button>
                            </div>
                </div>
                </>
            )}
            

        </div>



        {replies.map( (reply : Icomment) => <Singlecomment comment = {reply} replies = {[]} fetchData = {fetchData} /> ) }

        </>
    )
}

export default Singlecomment