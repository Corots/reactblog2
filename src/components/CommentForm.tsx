import Button from '@mui/material/Button';
import axios from 'axios';
import React, { useState } from 'react'
import guy from '../assets/img/guy.jpg';
import {Icomment} from './comments';
import {IForm, EnumSort} from './comments';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import ColorToggleButton from './MaterialUI/ColorToggleButton';



const CommentForm : React.FC<IForm> = ({fetchData,  articleId}) => {


    const defComment = {
            author: 'John Dada',
            text: '',
            likes: 0,
            dislikes: 0,
            replyId: null,
            id: '',
            articleId: articleId,
            date : new Date()
        }
    

    const [newComment, setNewComment] = useState<Icomment>(defComment);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment({ ...newComment, text: event.target.value });
    }


    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setNewComment({ ...newComment, date: new Date() });

        axios.post(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${articleId}/comments`, newComment)
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

                    {/* SortComments: EnumSort
                    setSortComments :  */}

                    {/* <div className="buttons">
                        <button className={`left ${SortComments == EnumSort.DATE ? 'active' : ''}`} onClick={() => (setSortComments(EnumSort.DATE))}>Latest</button>
                        <button className={`right ${SortComments == EnumSort.POPULARITY ? 'active' : ''}`} onClick={() => (setSortComments(EnumSort.POPULARITY))}>Popular</button>
                    </div> */}
                </div>

                <div className="text-area">
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
                </div>
            </div>
  )
}

export default CommentForm