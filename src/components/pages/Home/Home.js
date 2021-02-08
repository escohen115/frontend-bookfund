import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function Home({user}){

    const[books,setBooks] = useState([])
    let waitings = []
    let waitingsMapped = []

    useEffect(()=>{
        fetch(`http://localhost:3000/books`)
        .then(response=>response.json())
        .then(data=>{setBooks(data)})
    },[])

     if (books.length > 0){
        for(let i=0;i < books.length;i++){
            let waitingsFulFilled = books[i].waitings.filter(waitings=>waitings.fulfilled!==false).length

            waitings.push({[waitingsFulFilled]:books[i]})
        }
        waitings.sort(function (a, b){
            return Object.keys(b)[0] - Object.keys(a)[0]
        })
        waitingsMapped = waitings.slice(0,5).map(waiting=>{
            return( 
                <li>
                    <img src = {Object.values(waiting)[0].image_url}></img>
                    <Link to={`/bookpage/${Object.values(waiting)[0].api_id}`} >{Object.values(waiting)[0].title} </Link>
                    {/* <p>{Object.keys(waiting)[0]} users waiting </p> */}
                </li>

                )
            })

    }

    return(
        <>
            <h4>Top Books:</h4>
            <ol>{waitingsMapped.length>0 ? waitingsMapped :null} </ol>
            <h4>Top Sponsors:</h4>
        </>
    )
}