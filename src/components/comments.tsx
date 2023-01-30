import React, { useEffect, useState } from 'react'
import Singlecomment from './singlecomment'

import axios from 'axios';
import CommentForm from './CommentForm';

type Props = {
    articleId : number
}


export interface Icomment {
    id: string;
    articleId: string;
    author: string;
    text: string;
    likes: number;
    dislikes: number;
    replyId : number | null;
    date: Date;  
}

export interface ISingleComment{
    comment : Icomment
    replies : Icomment[]
    fetchData: () => void;
}


export interface IForm {
    articleId: string;
    fetchData: () => void;
    setSortComments: React.Dispatch<React.SetStateAction<EnumSort>>;
    SortComments: EnumSort;
  }


export interface Ibuttons{
    action : 'edit' | 'delete' | 'reply'
}


export enum EnumSort{
    POPULARITY = 'likes',
    DATE = 'date',
}






const Comments : React.FC<Props> = ({articleId}) => {

    const [isLoading, setisLoading] = useState(true);
    const [LoadedComments, setLoadedComments] = useState<Icomment[]>([]);

    const [SortComments, setSortComments ] = useState<EnumSort>(EnumSort.POPULARITY);


    // 

    const fetchData = async () => {
        setisLoading(true);
        const result = await axios.get(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${articleId}/comments?sortBy=${SortComments.valueOf()}&order=desc`);
        console.log('data from comments element', result.data);
        setLoadedComments(result.data);
        
      };

    useEffect(() => {
        fetchData().then(() => { setisLoading(false);});
      }, [articleId, SortComments]);


    const filterRootComments = (): Icomment[] =>{
        const result =  LoadedComments.filter((comment) => comment.replyId === null);
        return result;
    }
    

      const getReplies = (targetComment : Icomment): Icomment[] => {
        const result =  LoadedComments.filter((comment) => comment.replyId === Number(targetComment.id));

        

        return result.sort((a, b) => {
            return new Date(a.date).toISOString().localeCompare(new Date(b.date).toISOString())
        });
    }



    return (
        <div className="comment-section">
            <CommentForm fetchData={fetchData} setSortComments = {setSortComments} SortComments = {SortComments}  articleId = {String(articleId)}/>

            <div className="comments-history">
                {filterRootComments().map((comment: Icomment) => (
                    <Singlecomment key = {comment.id} fetchData={fetchData} comment = {comment} replies = {getReplies(comment)} />
                ))}
            </div>


        </div>
    )
}

export default Comments




