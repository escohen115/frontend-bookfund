import React, { useState } from "react"
import Search from './Search'
import SignUp from './SignUp'
import LogIn from './LogIn'
import UserPage from '../UserPage/UserPage'
import { Link } from "react-router-dom";

export default function MainNav ({setBooksFromSearch, setUser, user}){

    return(
        <div className="main-nav">
            <h2>bookFun(d)</h2>

           

            <p>{user ? `signed in as ${user.username}`: "signed out"} </p>

            <Search setBooksFromSearch={setBooksFromSearch}/>
            

            {user ? null : <LogIn setUser={setUser} user={user}/> }

            {/* {user ? null :<Link to="/signup"><button> SignUp </button></Link> } */}

            {user ? null :<SignUp setUser={setUser}/> }
            
            {user ? <Link to="/userpage"> <button> My Page </button> </Link> :null}

            <button onClick={()=>setUser(null)}>Sign Out</button>

            <Link to="/"> <button> Home </button> </Link>
        </div>
    )

}