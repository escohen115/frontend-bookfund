import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackEndBookCard from '../BookIndex/BackEndBookCard'
import { Card, Button } from 'semantic-ui-react'

export default function Home(){

    const[books,setBooks] = useState([])
    const[backEndWaitings, setBackEndWaitings] = useState([])
    const[users, setUsers] = useState([])
    const[index, setIndex] = useState(0)

    let waitings = []
    let waitingsMapped = []

    let sponsorsMapped = []

    useEffect(()=>{
        fetch(`http://localhost:3000/books`)
        .then(response=>response.json())
        .then(data=>{setBooks(data)})

        fetch(`http://localhost:3000/users`)
        .then(response=>response.json())
        .then(data=>{setUsers(data)})
        
        fetch(`http://localhost:3000/waitings`)
        .then(response=>response.json())
        .then(data=>{setBackEndWaitings(data)})
    },[])


     if (books.length > 0){
        for(let i=0;i < books.length;i++){
            let waitingsFulFilled = books[i].waitings.filter(waitings=>waitings.fulfilled!==false).length

            waitings.push({[waitingsFulFilled]:books[i]})
        }
        waitings.sort(function (a, b){
            return Object.keys(b)[0] - Object.keys(a)[0]
        })
        waitingsMapped = waitings.slice(index, (index+8)).map(waiting=>{
            return( <BackEndBookCard book = {Object.values(waiting)[0]}/>)
        })
    }

    if (backEndWaitings.length > 0){ 
        let sponsoredWaitings = backEndWaitings.filter(waiting=>waiting.fulfilled==true)
        let sponsorAOH=[]
        for (let i=0;i<users.length;i++){
            let userSponsors = sponsoredWaitings.filter(waiting=>waiting.sponsor_id===users[i].id)
            sponsorAOH.push({[userSponsors.length]:users[i]})
        }
        sponsorAOH.sort(function (a, b){
            return Object.keys(b)[0] - Object.keys(a)[0]
        })
        sponsorsMapped = sponsorAOH.slice(0,6).map(sponsor=>{
            return( 
                <li>
                    <img src = {Object.values(sponsor)[0].image_url}></img>
                    <Link to={`/otheruserpage/${Object.values(sponsor)[0].id}`} >{Object.values(sponsor)[0].username} </Link>
                    <p>sponsors: {Object.keys(sponsor)[0]}</p>
                </li>

                )
        })
    }

    return(
        <>
            <div className="home-info">
                <h2 className="who">
                    Who we are
                </h2>
                <p>
                    BookFund is a platform where users can sponsor books they love to share the joy and knowledge they’ve accumulated with others who share an interest.
                </p>
            </div>

                <h2 className="pop" >Popular Now</h2>
            <div className="popular-now">
                {waitingsMapped.length >0 ? 
                <Card.Group itemsPerRow={8}>
                    {waitingsMapped}  
                </Card.Group>
                :null} 
            </div>
                <div className="buttons-combined">
                    <Button className="next-back-button"  onClick={()=>setIndex(index+8)}>Next</Button>
                    {index > 0 ? <Button className="next-back-button" onClick={()=>setIndex(index-8)}>Back</Button>: null}
                </div>
            <div className="top-sponsors-home">
                <h4>Top Sponsors:</h4>
                <ol>{sponsorsMapped.length>0 ? sponsorsMapped :null} </ol>
            </div>
        </>
    )
}