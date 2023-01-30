import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

import guy from '../assets/img/guy.jpg';

import {Icomment, ISingleComment} from './comments'


import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';


// : React.FC<IForm>


// : React.FC<{ comment: Icomment , replies : Icomment[] }>

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

    const defaultReply = {
        author: 'John Dada',
        text: '',
        likes: 0,
        dislikes: 0,
        replyId: null,
        id: '',
        articleId: comment.articleId,
        date : comment.date,
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
                await axios.delete(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${comment.articleId}/comments/${comment.id}`);
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
        const updatedComment = await axios.get(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${comment.articleId}/comments/${comment.id}`);
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
            setnewReply({ ...newReply, text: `@${newComment.id} `, replyId : newComment.replyId || Number(newComment.id) })
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
            console.log('new date is', new Date())
            const postdata : Icomment = {...newReply, date : new Date() }
            console.log('seems like installed new date', postdata)


            const response = await axios.post(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${newComment.articleId}/comments/`, postdata);
        } catch (error) {
          console.error(error);
        }
        finally{
            console.log('REPLY ADDED!', newReply);
            setIsReplying(false);
            setnewReply(defaultReply);
            fetchData();
        }

    
      };


      const updateComment = async (updatedComment : any) => {
            try {
                const response = await axios.put(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${comment.articleId}/comments/${comment.id}`, updatedComment);
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
            

            <div className={newComment.replyId ? "comment comment-reply" : "comment"}>
            <div className="author-info">
                <div className="user">
                    <img src={guy} className="author-image" />
                    <p>{newComment.author}</p>
                </div>
                <div className="eclispe-menu-wrapper">

                    {!editing && !IsReplying &&

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
                        <div className="user" onClick={handleEditClick}>
                            <p>Edit</p>
                        </div>
                        <div className="user" onClick={handleDelete}>
                            <p>Delete</p>
                        </div>
                    </div>
                    }
{/* https://mui.com/material-ui/icons/ */}


                </div>
            </div>

            {editing ? (
            <textarea 
                style={{ resize: "vertical" }} 
                onChange={e => setnewComment({ ...newComment, text: e.target.value })} 
                value= {newComment.text}
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
                            
                            <button onClick={handleSaveClick}>Save</button>
                            <button onClick={handleCancelClick}>Cancel</button>
                        </div>
                    ):
                    (
                        <div className="buttons-reaction">
                            <button onClick={HandleLike}>👍 {newComment.likes}</button>
                            <button onClick={HandleDisike}>👎 {newComment.dislikes}</button>
                        </div>
                    )}

                {!editing && 
                <>
                    <div className="reply-button" onClick={handleStartReply}>Reply</div>
                    <div className="hours-ago">{timeAgo}</div>
                </>
                }
                

                
            </div>


            {IsReplying ? (
                <>
                <div>Leave a comment</div>
                <textarea 
                    style={{ resize: "vertical" }}  
                    defaultValue= {`@${newComment.id} `} 
                    onChange={e => setnewReply({ ...newReply, text: e.target.value, replyId : newComment.replyId || Number(comment.id) })}
                />
                
                <div className="controlpanel">
    
                        
                            <div className="buttons-reaction">
                                <button onClick={PostReplyHandler}>Post a reply</button>
                                <button onClick={CancelReplyHandler}>Cancel</button>
                            </div>
                </div>
                </>
            ) : ''}
            

        </div>



        {replies.map( (reply : Icomment) => <Singlecomment comment = {reply} replies = {[]} fetchData = {fetchData} /> ) }

        </>
    )
}

export default Singlecomment