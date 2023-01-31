import Button from '@mui/material/Button'
import React from 'react'
import { Link } from 'react-router-dom'

type Props = {}

const Anouncment : React.FC = (props: Props) => {
  return (
    <div className="anouncment">
    <div className="title">Time to get your house clean and in order</div>
    <div className="subtitle">Practical advices how to make your home a place you want to be</div>
     

        <Link to='/article/1' className="read">
          <Button fullWidth variant="contained">Read article</Button>
        </Link>
  
    
    {/* <button className="read">Read article</button> */}
    <div className="image"></div>
</div>
  )
}

export default Anouncment