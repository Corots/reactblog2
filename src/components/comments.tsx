import React, { useEffect, useState } from 'react'
import Singlecomment from './singlecomment'

import axios from 'axios';
import CommentForm from './CommentForm';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { commentFilter } from '../redux/comments/selectors';
import { SortPropertyEnum } from '../redux/comments/types';
import CommentSkeleton from './Comment/skeleton';

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
    // setSortComments: React.Dispatch<React.SetStateAction<EnumSort>>;
    // SortComments: EnumSort;
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


    

    const {SortProperty} = useSelector(commentFilter);

    

    const fetchData = async (SortProperty: SortPropertyEnum) => {
        setisLoading(true);
        const result = await axios.get(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${articleId}/comments?sortBy=${getFilterTagByReduxData(SortProperty).valueOf()}&order=desc`);
        console.log('data from comments element', result.data);
        setLoadedComments(result.data);
        setisLoading(false);
        
      };

    
    const getFilterTagByReduxData = (SortProperty: SortPropertyEnum) => {
        if (SortProperty === SortPropertyEnum.DATE){
            return EnumSort.DATE;
        }
        else if (SortProperty === SortPropertyEnum.POPULARITY)
        {
            return EnumSort.POPULARITY;
        }
        else{
            return EnumSort.POPULARITY;
        }
    }
    

    useEffect(() => {
        fetchData(SortProperty);
      }, [articleId, SortProperty]);


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
            <CommentForm fetchData={() => fetchData(SortProperty)}  articleId = {String(articleId)}/>

            <div className="comments-history">
            {
                isLoading ?  
                    [...new Array(8)].map( (_, index) => <CommentSkeleton key = {index}/>  ) : 
                    
                    filterRootComments().map((comment: Icomment) => (
                        <Singlecomment key = {comment.id} fetchData={() => fetchData(SortProperty)} comment = {comment} replies = {getReplies(comment)} />
                    ))
            }
            </div>
        </div>
    )
}

export default Comments




