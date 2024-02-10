/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { database } from "@/firebase"
import { initSocket } from "@/socket"
import { func } from "prop-types"
import { useEffect, useState } from "react"


export default function ChatArea({socketRef, teamID}){
  const [inputMessage, setInputMessage] = useState('first')
  const [sendMessage, setSendMessage] = useState([])
  const [clientMessage, setClientMessage] = useState([])
  function onChange(e){
    setInputMessage(e.target.value)
  }
  
  
  useEffect(() => {
    if(socketRef.current!= null)
      socketRef.current.on('receive_message', (inputMessage)=>{console.log(inputMessage);setClientMessage([...clientMessage, inputMessage])})
  },[socketRef.current])

  
  function onSend(){
    setSendMessage([...sendMessage, inputMessage])
    const message = {
      username: sessionStorage.getItem('username'),
      message: inputMessage,
      timestamp: new Date().getTime()
    }
    console.log(message, clientMessage)
    database.ref('chat').push(message).then((e) => console.log('inserted')).catch((e) => console.log('rejected'))
    setSendMessage([...sendMessage, inputMessage])
    sendMessage.push(inputMessage)

    socketRef.current.emit('send_message', {teamID, inputMessage});
    setInputMessage('')
  }
  
  return( 
      <div className="chat-area">
          <div className="chat">{sendMessage.map((message, index) => <h6 key={index}>{message}</h6>)}{clientMessage.map((message, index) => <h6 key={index}>{message}</h6>)}</div>
          <div className="chat-input">
              <input type="text" value={inputMessage} onChange={onChange}/>
              <button id="send-chat" onClick={onSend}>&#11166;</button>
          </div>
      </div>
  )
}