import React, { useState } from "react"
import Search from './Search'
import SignUp from './SignUp'
import LogIn from './LogIn'
import UserPage from '../UserPage/UserPage'
import { Link } from "react-router-dom";

export default function MainNav ({setBooksFromSearch, setUser, user, startIndex, setStartIndex}){

    return(
        <div className="main-nav">
            <h1 className="logo">bookFun(d)</h1>

           

            <p>{user ? `signed in as ${user.username}`: "signed out"} </p>

            <Search 
            setBooksFromSearch={setBooksFromSearch}
            startIndex={startIndex}
            setStartIndex={setStartIndex}/>
            

            {user ? null : <LogIn setUser={setUser} user={user}/> }

            {/* {user ? null :<Link to="/signup"><button> SignUp </button></Link> } */}

            {user ? null :<SignUp setUser={setUser}/> }
            
            {user ? <Link to="/userpage"> <button> My Page </button> </Link> :null}

            <button onClick={()=>setUser(null)}>Sign Out</button>

            <Link to="/"> <button> Home </button> </Link>
        </div>
    )

}