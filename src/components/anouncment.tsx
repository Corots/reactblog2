import React from 'react'

type Props = {}

const Anouncment : React.FC = (props: Props) => {
  return (
    <div className="anouncment">
    <div className="title">Time to get your house clean and in order</div>
    <div className="subtitle">Practical advices how to make your home a place you want to be</div>
    <button className="read">Read article</button>
    <div className="image"></div>
</div>
  )
}

export default Anouncment