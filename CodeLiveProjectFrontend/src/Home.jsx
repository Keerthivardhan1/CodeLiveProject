import React, { useEffect, useRef, useState } from 'react'
import "./index.css"
import Client from './Components/Client'
import Editor from './Components/Editor'
import ChatArea from './Components/Chat'
import { initSocket } from './socket'
import ACTIONS from './Actions'
import { Navigate, useLocation  , useNavigate , useParams} from 'react-router-dom'
import { toast } from 'react-hot-toast'
import logo from './assets/logo.svg'
import { database } from './firebase';
import { Button } from './Components/ui/button'
import Tile from './Components/Tile'
import { Alert, AlertDescription, AlertTitle } from './Components/ui/alert'

const Home = () => {

  /*
    useState == if state changes whole components get rerender 

    useRef == if the state of the object changes components will not get rerender again 
  */
 
    const socketRef = useRef(null); 
    const location = useLocation();
    const reactNavigator = useNavigate();
    const {teamID} = useParams();  
    let codeToSave = useRef(null);
    const codeRef = database.ref('code').child(teamID);

    const [clients , setClients] = useState([])
    const [sessionClients, setSessionClients] = useState([])


    let isRoomLocked = new Map(); // To check whether room is locked or not

    isRoomLocked.set(teamID , false);

  

    useEffect(()=>{
      const init = async ()=>{
        socketRef.current = await initSocket();
        socketRef.current.on('connect_error' , (err) => handleErrors(err))
        socketRef.current.on('connect_failed' , (err) => handleErrors(err))

        function handleErrors(err) {
            toast.error("Socket Connection Faild , try again later" );
            reactNavigator('/')
        }


        // Notifying server with specified username and teamID

        socketRef.current.emit(ACTIONS.JOIN , {
          teamID,
          userName : location.state?.userName,
        })


        // Server call this after perticular user joined the team to let all the team members known who is joined 


        socketRef.current.on(ACTIONS.JOINED , 

          ({clients , userName , socketID}) =>{
            if(userName !== location.state?.userName){
              toast.success(`${userName} joined team`)
            }
            console.log( "un = ",userName)
            // setClients((prev)=>[...prev , {userName , socket:socketID}] )
            console.log("clients = ", clients)
            setClients(clients)
            console.log(sessionClients + 'j1')
            sessionStorage.setItem(teamID , sessionClients );
          
          })

        socketRef.current.on(ACTIONS.DISCONNECTED , ({socketID , userName})=>{
          if(userName !== location.state?.userName){
            toast.success(`${userName} had left the team`)
            setClients((prev) => {
              return prev.filter(client => client.socketID !== socketID)
            })
          }
        })

        


      
      }
      init()
      

    

    } , [])

    useEffect(()=>{
      if(clients == null){
        setClients(localStorage.getItem('clients'));
      } 
    }
      , [])

    function handleLeave(){
      reactNavigator('/')
      toast.success(" Please close this tab to complete the disconnection process.")
    }

    async function CopyTeamID(){
      try {
        await navigator.clipboard.writeText(teamID);
        toast.success("Team ID copied to clipboard");
      } catch (e) {
        toast.error("Failed to copy Team ID");
      }
    }

    function handlecodechange(code){

      codeToSave = code;
      codeRef.set(codeToSave)


    }

    function clearStorage(){
      codeRef.remove()
      .then(()=>toast.success("code is cleared from databse"))
      .catch((err)=>toast.error("unable to clear the code in databse " ))
    }

    function handleLook() {
      isRoomLocked.set(teamID,true)
      console.log("handleLook")
      socketRef.current.emit("look", {teamID,userName : location.state?.userName})
    }

  if(!location.state){
    return <Navigate to='/'/>
  }

  return (
    <>
    <div className="Home">
        <div className="left">
          <div className="asideInner flex flex-col justify-between items-center">
            <div>
            <div className='left-heading lh' >
              <img className="logo3 " src={logo} alt="" />
              <h3 className=''>Collaborative Code</h3>
            </div>
            <h3>Connected</h3>
            <div className="clientsList">
              {clients.map((client , index) => (
                      <Client 
                        key={index}
                        username = {client.username}
                      />
                  ))}
                  
            </div>
            </div>

            <div className='allbtns '>
              <div className='btn flex-col gap-2' >
            
                <div className='flex gap-[3rem] items-center'>
                <button className='Lock The Editor' onClick={handleLook}>Lock</button> 
                <Button className=" copyBtn" variant="outline" onClick={CopyTeamID}>Copy Team ID</Button>
                </div>
              <div className='flex gap-[3rem] items-center' >
                <Button className="leave" onClick={handleLeave} >Leave</Button>
                <button onClick={clearStorage}>Clear Database</button>

                </div>
              </div>

            </div>

            
            
          </div>
        </div>

        <div className="middle">
          <Editor 
          socketRef = {socketRef} 
          teamID = {teamID}  
          onCodeChange = { handlecodechange }
          codeRef = {codeRef}
          />
        </div>
        
        <div className='right'>
          {sessionStorage.getItem('loggedIn') == 'true'?
          <ChatArea 
          socketRef = {socketRef} 
          teamID = {teamID}/> : 
          <Alert className="mt-64 w-4/5 ml-4  ">
            <AlertTitle><a href='/'>Please Sign In</a></AlertTitle>
            <AlertDescription>Chat   Feature Needs Authenication</AlertDescription>
          </Alert>}
        </div>
    </div>
    </>
  )
}

export default Home