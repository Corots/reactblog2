import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ArticleText from '../components/articleText'
import Comments from '../components/comments'



type Props = {}


interface Iarticle {
  id: number;
  title: string;
  text: string;
  author: string;
  date: string;
}

const ArticlePage  : React.FC = (props: Props) => {

  let { id } = useParams();

  const [article, setArticle] = useState<Iarticle>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`https://63d480dc0e7ae91a009e281b.mockapi.io/api/v1/articles/${id}`);
      setArticle(result.data);
      console.log('data from article element', result.data);

    };

    fetchData();
  }, [id]);


  if (!article){
    return <></>
  }

  if (!id)
    {
      return <></>
    }
  
  return (
   <>
   <ArticleText article = {article} />
   <Comments articleId={parseInt(id)}/>
   </> 
  )
}

export default ArticlePage