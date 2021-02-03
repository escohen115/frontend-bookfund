import React, { useState } from "react"
import Search from './Search'
import SignUp from '../../SignUp'
import LogIn from './LogIn'

export default function MainNav ({setBooksFromSearch, setUser}){


    return(
        <div className="main-nav">
            <Search setBooksFromSearch={setBooksFromSearch}/>
            <SignUp setUser={setUser}/>
            <LogIn setUser={setUser}/>
        </div>
     
    )
}