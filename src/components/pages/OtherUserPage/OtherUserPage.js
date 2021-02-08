import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react"

export default function OtherUserPage(){

    const [otherUser, setOtherUser] = useState(null)
    
    const params = useParams()
    useEffect(()=>{
        fetch(`http://localhost:3000/users/${params.id}`)
        .then(response => response.json())
        .then(data=>setOtherUser(data))  
    },[])

    if (otherUser){
        return(
            <div> 
                <img src={otherUser.profile_pic ? otherUser.profile_pic : null}></img>
                <p>name: {otherUser.name ? otherUser.name : null}</p>
                <p>email: {otherUser.email ? otherUser.email : null}</p>
                <p>username: {otherUser.username ? otherUser.username : null }</p>
                <p>bio: {otherUser.bio ? otherUser.bio : null}</p>
            </div>
        )
    }
    else{
        return <p>loading</p>
    }
}

