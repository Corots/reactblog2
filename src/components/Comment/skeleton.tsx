import React from "react"
import ContentLoader from "react-content-loader"

const CommentSkeleton = () => (
  <ContentLoader 
    speed={2}
    width={490}
    height={203}
    viewBox="0 0 490 203"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="1" y="165" rx="9" ry="9" width="70" height="37" /> 
    <rect x="87" y="163" rx="4" ry="4" width="63" height="41" /> 
    <rect x="2" y="91" rx="0" ry="0" width="496" height="24" /> 
    <rect x="-7" y="122" rx="0" ry="0" width="432" height="24" /> 
    <circle cx="37" cy="38" r="23" /> 
    <rect x="71" y="30" rx="0" ry="0" width="92" height="24" /> 
    <rect x="203" y="173" rx="0" ry="0" width="59" height="26" /> 
    <rect x="316" y="177" rx="0" ry="0" width="106" height="21" />
  </ContentLoader>
)

export default CommentSkeleton


