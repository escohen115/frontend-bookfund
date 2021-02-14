import { useParams, Link} from "react-router-dom";
import React, { useEffect, useState } from "react"
import BackEndBookCard from '../BookIndex/BackEndBookCard'

export default function OtherUserPage({savedBooks}){

    const [otherUser, setOtherUser] = useState(null)

    const params = useParams()
    let waitingsMapped = []
    let waitlistMapped = []
    

    useEffect(()=>{
        fetch(`http://localhost:3000/users/${params.id}`)
        .then(response => response.json())
        .then(data=>setOtherUser(data))  
    },[])


    if (otherUser && savedBooks.length > 0){  

        let waitingsUnfulfilled = otherUser.waitings.filter(waiting=>waiting.fulfilled!==true)
        for(let i=0;i<waitingsUnfulfilled.length;i++){
        waitingsMapped.push(savedBooks.find(saved_book => saved_book.id === waitingsUnfulfilled[i].book_id))
        } 
        waitlistMapped = waitingsMapped.map(waiting=>{
            return (<BackEndBookCard book={waiting}/>)
        })
 
        return(
            <div> 
                <img src={otherUser.profile_pic ? otherUser.profile_pic : null}></img>
                <p>name: {otherUser.name ? otherUser.name : null}</p>
                <p>email: {otherUser.email ? otherUser.email : null}</p>
                <p>username: {otherUser.username ? otherUser.username : null }</p>
                <p>bio: {otherUser.bio ? otherUser.bio : null}</p>
                <p>waitlist:</p>
                <ul>{waitingsMapped.length > 0 ? waitlistMapped:null}</ul>
            </div>
        )
    }
    
    else{
        return <p>loading</p>
    }
}

