import Button from '@mui/material/Button';
import axios from 'axios';
import React, { useState } from 'react'
import guy from '../assets/img/guy.jpg';
import {Icomment} from './comments';
import {IForm, EnumSort} from './comments';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import ColorToggleButton from './MaterialUI/ColorToggleButton';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { favoriteFilter } from '../redux/favorite/selectors';



const CommentForm : React.FC<IForm> = ({fetchData,  articleId}) => {

    const {logged} = useSelector(favoriteFilter);

    const defComment = {
            id: 1,
            text: '',
            reply_id: null,
            likes: 0,
            dislikes: 0,
            date : new Date().toString(),
            author: 'John Dada',
            author_id: 1,
            article_id : 1,
        }
    

    const [newComment, setNewComment] = useState<Icomment>(defComment);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment({ ...newComment, text: event.target.value });
    }


    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {

        const query = {
            token : localStorage.getItem("access_token"),
        }
        const body = {
            text : newComment.text,
            date : new Date().toISOString(),
        }


        event.preventDefault();
        axios.post(`https://myawesomeapp.me/api/article/${articleId}/comment`, body, {params : query})
          .then(response => {
            console.log(response);
            setNewComment(defComment);
            fetchData();
            console.log('Data is fetched!')
          })
          .catch(error => {
            console.log(error);
          });
      }

       

      

  return (
    <div className="comment-block">
                <div className="top-section">
                    <div className="comment">Comments</div>
                    <ColorToggleButton/>

                
                </div>
                

                {logged  ? 
                (<div className="text-area">
                    {/* <div className="popup-users">

                        <div className="user">
                            <img src={guy} className="author-image"></img>
                            <p>Dormor Fox</p>
                        </div>

                        <div className="user">
                            <img src={guy} className="author-image"></img>
                            <p>Dormor Fox</p>
                        </div>

                        <div className="user">
                            <img src={guy} className="author-image"></img>
                            <p>Dormor Fox</p>
                        </div>

                    </div> */}


                        <TextField
                            sx={{width : "100%"}}
                            id="outlined-multiline-static"
                            label="Comment text"
                            multiline
                            rows={8}
                            value={newComment.text} 
                            onChange={handleChange}
                         />


                        <div className="control-comment">
                            <div className="font-settings">
                                <button className="font-button font-bold">B</button>
                                <button className="font-button font-italic">I</button>
                                <button className="font-button font-underline">U</button>
                                <button className="font-button font-dog">@</button>

                            </div>
                            <Button variant="contained" endIcon={<SendIcon />} disabled={newComment.text === ''} onClick={handleSubmit}>Send</Button>
                        </div>
                </div>) : (
                    <div>Please log in to leave a comment</div>


                )
                }


            </div>
  )
}

export default CommentForm