import React, { useState } from 'react'
import "../index.css"

const Avatar = ({name}) => {
    const [letter , setLetter] = useState(name[0]);
  return (
    <>
    <div className='joines'>
    <div className='avatar'>{letter}
    </div>
    </div>
    </>
    
  )
}

export default Avatar