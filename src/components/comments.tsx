import React, { useEffect, useState } from 'react'
import Singlecomment from './singlecomment'

import axios from 'axios';
import CommentForm from './CommentForm';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { commentFilter } from '../redux/comments/selectors';
import { SortPropertyEnum } from '../redux/comments/types';
import CommentSkeleton from './Comment/skeleton';
import { favoriteFilter } from '../redux/favorite/selectors';
import CheckApi from './auth/useAuth';

type Props = {
    articleId : number
}


export interface Icomment {
    id: number;
    text: string;
    reply_id : number | null;
    likes: number;
    dislikes: number;
    date: string;  
    author_id: number;
    article_id : number;
    author : string;

    liked? : boolean;
    disliked? : boolean;

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
    const {logged} = useSelector(favoriteFilter);

    

    const fetchData = async (SortProperty: SortPropertyEnum) => {
        setisLoading(true);

        console.log('inside comments. Logged?', logged)

        if (logged){

            

            const MyUpdateCommentPromise = (access_token : string) => {
                const query = {
                    token : access_token,
                }
                return axios.get<Icomment[]>(`https://myawesomeapp.me/api/article/${articleId}/comments?sortBy=${getFilterTagByReduxData(SortProperty).valueOf()}&order=desc` ,  {params : query});
            }

            const Comments = await CheckApi(MyUpdateCommentPromise); 
            if (Comments){
                setLoadedComments([]);
                console.log('new data - ', Comments.data)
                setLoadedComments(Comments.data);
                setisLoading(false);
            }
            

        }
        else{
            const result = await axios.get<Icomment[]>(`https://myawesomeapp.me/api/article/${articleId}/comments?sortBy=${getFilterTagByReduxData(SortProperty).valueOf()}&order=desc`);
            console.log('data from comments element', result.data);
            
            setLoadedComments(result.data);
            setisLoading(false);
        }


        
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
        const result =  LoadedComments.filter((comment) => comment.reply_id === null);
        return result;
    }
    

      const getReplies = (targetComment : Icomment): Icomment[] => {
        const result =  LoadedComments.filter((comment) => comment.reply_id === Number(targetComment.id));

        

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
                    [...new Array(8)].map( (_, index) => <CommentSkeleton key = {index} big = {false}/>  ) 
                    : 
                    filterRootComments().map((comment: Icomment) => (
                        <Singlecomment key = {comment.id} fetchData={() => fetchData(SortProperty)} comment = {comment} replies = {getReplies(comment)} />
                    ))
            }
            </div>
        </div>
    )
}

export default Comments




