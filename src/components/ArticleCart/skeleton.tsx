import React from "react"
import ContentLoader from "react-content-loader"

const Skeleton = () => (


  
<ContentLoader 
    speed={2}
    width={284}
    height={457}
    viewBox="0 0 284 457"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    className="article-cart article-cart-skeleton"

  >
    <rect x="20" y="232" rx="3" ry="3" width="244" height="55" /> 
    <rect x="22" y="21" rx="3" ry="3" width="243" height="193" /> 
    <circle cx="54" cy="407" r="21" /> 
    <rect x="19" y="305" rx="0" ry="0" width="240" height="55" /> 
    <rect x="90" y="387" rx="0" ry="0" width="104" height="14" /> 
    <rect x="89" y="410" rx="0" ry="0" width="103" height="15" />
  </ContentLoader>
)

export default Skeleton

