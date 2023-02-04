import React, { useEffect, useState } from "react"
import ContentLoader from "react-content-loader"

const CommentSkeleton : React.FC<{big : boolean}> = ({big}) => {

  const [isBig, setIsBig] = useState<boolean>(window.innerWidth > 550);

  return(
    <ContentLoader 
    speed={2}
    width={isBig ? 490 : 290}
    height={203}
    viewBox={isBig ? "0 0 490 203" : "0 0 290 203" }
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="1" y="165" rx="9" ry="9" width="70" height="37" /> 
    <rect x="87" y="163" rx="4" ry="4" width="63" height="41" /> 
    <rect x="2" y="91" rx="0" ry="0" width={isBig ? "496" : "296"} height="24" /> 
    <rect x="-7" y="122" rx="0" ry="0" width={isBig ? "432" : "232"} height="24" /> 
    <circle cx="37" cy="38" r="23" /> 
    <rect x="71" y="30" rx="0" ry="0" width="92" height="24" /> 
    <rect x="203" y="173" rx="0" ry="0" width="59" height="26" /> 
    {   isBig && <rect x="316" y="177" rx="0" ry="0" width="106" height="21" />   }
  </ContentLoader>
  )
}
  


export default CommentSkeleton


