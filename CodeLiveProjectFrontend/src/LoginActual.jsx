// import { useState } from 'react';
// import {app, database} from './firebase'
// import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';


// const Signup = () => /
// //   const [username, setUsername] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const userCredential = await createUserWithEmailAndPassword(getAuth(app), email, password);
// //       await database.ref(`users/${userCredential.user.uid}`).set({ username });
// //       console.log("user created" + userCredential)
      
// //     } catch (error) {
// //       console.error('Error signing up:', error);
// //     }
// //   }

//   return (
//     // <form onSubmit={handleSubmit}>
//     //   <label>
//     //     Username:
//     //     <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
//     //   </label>
//     //   <label>
//     //     Email:
//     //     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//     //   </label>
//     //   <label>
//     //     Password:
//     //     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//     //   </label>
//     //   <button type="submit">Submit</button>
//     // </form>
//   )


// export default Signup;
import { useState } from 'react';
// import Cookies from 'js-cookie'
// import Tile from './Components/Tile';
import { useNavigate } from 'react-router-dom';
import {app} from './firebase';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import * as React from "react"
// import {app, database} from './firebase'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



export default function LoginActual() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(getAuth(app), email, password).then((userCredential) => {
        console.log(userCredential)
        sessionStorage.setItem('loggedIn', true);
        sessionStorage.setItem('email',email)
        navigate("/Dashboard")
    }).catch((e)=>{
      confirm(e + "false")
      sessionStorage.setItem('loggedIn', false)
  })
  }
  return (
    <div>
     

    <Card className="w-[350px] " >
      
      <CardHeader>
        <CardTitle>LogIn</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            {/* <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div> */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <Label htmlFor="">Password</Label>
              <Input id="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <CardFooter className="flex justify-between">
            <Button onClick={handleSubmit} >Login</Button>
      </CardFooter>
          </div>
        </form>
      </CardContent>
      
    </Card>
  


    </div>
  )
}
