import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import  {v4 as uuidv4} from 'uuid';


export default function Loginbox() {
    const [submited , setSubmited]= useState(false);
    const navigate = useNavigate();
    let [teamID , setTeamID] = useState("");
    const [userName , setUserName] = useState("");

const handelSubmit = (e)=>{
    e.preventDefault();
    if(teamID == "" || userName  == "") {
        toast.error("Team ID and username are required")
        return;
    }
    sessionStorage.setItem('username', userName)
    console.log(sessionStorage.getItem('username'))
    
    navigate(`/Home/${teamID}` , {
        state: {
            userName
        }
    })
}
const createNewTeam = (e)=>{
    e.preventDefault();
    const id = uuidv4();
    setTeamID(id)
    toast.success("Created New Team")
}
const handleEnter = (e)=>{
    if(e.code === 'Enter'){
        handelSubmit(e);
    }
}

  return (
    <div className="login-box"> 
                <form  onSubmit={handelSubmit} action="" method="get" >
                    <div className=" user-box">
                    <input type="text" name="teamID" required="" value={teamID } onKeyUp={handleEnter} onChange={(e)=>setTeamID(e.target.value)}/>
                    <label>TeamID</label>
                    </div>
                    <div className="user-box">
                    <input type="text" name="" required="" value={userName} onKeyUp={handleEnter} onChange={(e)=>setUserName(e.target.value)} />
                    <label>UserName</label>
                    </div><center>           
                    <button type="submit" onChange={()=>setSubmited(true)}>JOIN </button>     
                    </center>
                    <span>If your are the Team Lead , <a onClick={createNewTeam} href="" className='aInP'>Create Team ID</a></span>
                </form>
            </div>  
  )
}
