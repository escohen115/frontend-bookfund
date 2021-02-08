
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";

export default function UserPage({user, savedBooks}){

    const[userWaitings, setUserWaitings] = useState([])

    let waitingsMapped = []

    if (user){  

        let waitingsUnfulfilled = user.waitings.filter(waiting=>waiting.fulfilled!==true)
        for(let i=0;i<waitingsUnfulfilled.length;i++){
        waitingsMapped.push(savedBooks.find(saved_book => saved_book.id === waitingsUnfulfilled[i].book_id))
        } 
        let waitlistMapped = waitingsMapped.map(waiting=>{
            return (
            <li>
                <img src = {waiting.image_url }></img>
                <Link to={`/bookpage/${waiting.api_id}`}>{waiting.title}</Link>
            </li>
            )
        })

    return(
        <div> 
            <img src={user.profile_pic ? user.profile_pic : null}></img>
            <p>name:{user.name ? user.name : null}</p>
            <p>email:{user.email ? user.email : null}</p>
            <p>username:{user.username ? user.username : null }</p>
            <p>bio:{user.bio ? user.bio : null}</p>
            <p>waitlist</p>
            <ul>{waitingsMapped.length>0 ? waitlistMapped:null}</ul>
            <p>sponsored list</p>
            <p>received list</p>
        </div>
    )
    }
    else{
        return null
    }
}