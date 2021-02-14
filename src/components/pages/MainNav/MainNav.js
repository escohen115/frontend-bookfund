import React, { useState } from "react"
import Search from './Search'
import SignUp from './SignUp'
import LogIn from './LogIn'
import UserPage from '../UserPage/UserPage'
import { NavLink } from "react-router-dom";
import { Button } from 'semantic-ui-react'
import { Input, Menu } from 'semantic-ui-react'

export default function MainNav ({setBooksFromSearch, setUser, user, startIndex, setStartIndex}){

    return(
        <div className="main-nav">

            <ul>
                <li className="logo">
                    <h1 >bookFun(d)</h1>
                    <p className="signed-in">{user ? `signed in as ${user.username}`: "signed out"} </p>
                </li>
                <li className= "search-form">
                    <Search 
                    setBooksFromSearch={setBooksFromSearch}
                    startIndex={startIndex}
                    setStartIndex={setStartIndex}
                    />
                </li>
                <div className = "navLinks">
                    <li>
                        {user ? null :<NavLink to="/signup"> SignUp </NavLink> }
                    </li>
                    <li>
                        {user ? null :<NavLink to="/login"> Login </NavLink> }
                    </li>
                    <li>
                        {user ? <NavLink to="/userpage">  My Page  </NavLink> :null}
                    </li>
                    <li>
                        {user?<NavLink to="/"className="navLinks" onClick={()=>setUser(null)}>Sign Out</NavLink>:null}
                    </li>
                    <li>
                        <NavLink to="/">  Home  </NavLink>
                    </li>
                </div>
            </ul>
            
            
            

            
            
            

            
        </div>
    )

}