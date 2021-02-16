
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import Timer from './Timer'
import BackEndBookCard from '../BookIndex/BackEndBookCard'
import { Card, Button } from 'semantic-ui-react'

export default function UserPage({user, savedBooks, timeLeft, setTimeLeft, reviewLeft, setReviewLeft}){

    let waitingsMapped = []
    let waitingsFulFilledMapped = []
    let mostRecent = {}
    let foundBook = null
    let foundReview = null
    let receivedMapped = null
    let waitlistMapped = null
    let displayTimer = false
    let sponsoredWaitings = []
    let sponsoredMapped = []
    
    const [allWaitings, setAllWaitings] = useState([])
    const[displayTimerTwo, setDisplayTimerTwo] = useState(true)
    const[index, setIndex] = useState(0)
    const [waitlistIndex, setWaitlistIndex] = useState(0)
    const [sponsoredIndex, setSponsoredIndex] = useState(0)
    

    useEffect(()=>{
    fetch(`http://localhost:3000/waitings`)
    .then(response=>response.json())
    .then(data=> setAllWaitings(data))
    },[])
    
    if (user){ 
        if (user.waitings.length < 2){
             setTimeLeft(false)
             setReviewLeft(true)
        }

        let waitingsUnfulfilled = user.waitings.filter(waiting=>waiting.fulfilled!==true)//get all unfulfilled waitings for a user
        for(let i=0;i<waitingsUnfulfilled.length;i++){
            waitingsMapped.push(savedBooks.find(saved_book => saved_book.id === waitingsUnfulfilled[i].book_id))//create an array of those books by comparing to saved books
        } 
        if (waitingsMapped.length > 0){
            waitlistMapped = waitingsMapped.map(waiting=>{ //create JSX of books
                return (<BackEndBookCard book={waiting}/>)
            })
        }
        if (allWaitings.length > 0){
            sponsoredWaitings = allWaitings.filter(waiting=>waiting.sponsor_id === user.id)
            sponsoredMapped = sponsoredWaitings.map(waiting=>{ //create JSX of books
                return (<BackEndBookCard book={waiting}/>)
            })
        }

        let waitingsFulfilled = user.waitings.filter(waiting=>waiting.fulfilled===true) //get all fulfilled waitings for a user
        for(let i=0;i<waitingsFulfilled.length;i++){
            waitingsFulFilledMapped.push(savedBooks.find(saved_book => saved_book.id === waitingsFulfilled[i].book_id)) //create an array of those books by comparing to saved books
        } 


        if (savedBooks.length > 0){
            receivedMapped = waitingsFulFilledMapped.map(waiting=>{ //create JSX of books
                return (<BackEndBookCard book={waiting}/>)
            })
        }

        

        if (waitingsFulfilled.length > 0){
            mostRecent = (waitingsFulfilled.sort(function (a, b){ // find most recent received
                return b.id - a.id
            })[0])
            if (Object.keys(mostRecent).length !== 0){ // if theres not most recent book
                
                //check mostRecent.waiting date. if no time left between creation and future deadline, setTimeLeft(false), and vice versa
                let creationDate = new Date(parseInt(mostRecent.sponsor_date)+20000).getTime()
                let now = new Date().getTime()

                if (now < creationDate){ // wait period has not passed
                    displayTimer = true
                }
                else
                {
                    displayTimer = false
                    setTimeLeft(false)
                }

            }
                foundBook = savedBooks.find(book=>book.id===mostRecent.book_id) // find most recently received book based on most recent waiting
                if (foundBook){
                    foundReview = foundBook.reviews.find(review=>review.user.id===user.id) // check if they left a review on it
                    if (foundReview){
                        setReviewLeft(true)
                    }
                    else{
                        setReviewLeft(false) //if book was found without a review
                    }
                    
                }
                else{ // if no book is on received list
                    setReviewLeft(true)
                }
        }

    }
    if (user){
        console.log('timeleft:', timeLeft)
        return(
            <div className="userpage"> 
            { displayTimer && displayTimerTwo ?
                <Timer 
                    mostRecent={mostRecent}
                    timeLeft={timeLeft} 
                    setTimeLeft={setTimeLeft}
                    displayTimer={displayTimer}
                    setDisplayTimerTwo={setDisplayTimerTwo}
                    reviewLeft={reviewLeft}
                />
            : null}
                {displayTimer === false && reviewLeft === true ? <h3>Looks like you're eligible for your next book!</h3> : null}
                {reviewLeft === false && mostRecent!== null && (user.waitings.length > 0) ? <p>please leave a review for: <BackEndBookCard book={foundBook}/> </p>: null}
                <img src={user.profile_pic ? user.profile_pic : null}></img>
                <p>name:{user.name ? user.name : null}</p>
                <p>email:{user.email ? user.email : null}</p>
                <p>username:{user.username ? user.username : null }</p>
                <p>bio:{user.bio ? user.bio : null}</p>

                <h3 className="pop">waitlist:</h3>
                {waitingsMapped.length > 0 ? 
                    <>
                        <div className="userpage-book-display">
                            <Card.Group itemsPerRow={8}>
                                {waitlistMapped.slice(waitlistIndex, waitlistIndex+8)}  
                            </Card.Group>
                        </div>
                        <Button className="next-back-button"  onClick={()=>setWaitlistIndex(waitlistIndex+8)}>Next</Button>
                        {waitlistIndex > 0 ? <Button className="next-back-button"  onClick={()=>setIndex(waitlistIndex-8)}>Back</Button>: null}
                    </>
                :null}

                <h3 className="pop">received:</h3>
                {waitingsFulFilledMapped.length > 0 ? 
                    <>
                        <div className="userpage-book-display">
                            <Card.Group itemsPerRow={8}>
                                {receivedMapped.slice(index, index+8)}  
                            </Card.Group>
                        </div>
                        <Button className="next-back-button"  onClick={()=>setIndex(index+8)}>Next</Button>
                        {index > 0 ? <Button className="next-back-button"  onClick={()=>setIndex(index-8)}>Back</Button>: null}
                    </>
                :null}


                <h3 className="pop">sponsored list</h3>
                {sponsoredMapped.length > 0 ?
                    <>
                        <div className="userpage-book-display">
                            <Card.Group itemsPerRow={8}>
                                {receivedMapped.slice(sponsoredIndex, sponsoredIndex+8)}  
                            </Card.Group>
                        </div>
                        <Button className="next-back-button"  onClick={()=>setSponsoredIndex(sponsoredIndex+8)}>Next</Button>
                        {sponsoredIndex > 0 ? <Button className="next-back-button"  onClick={()=>setSponsoredIndex(sponsoredIndex-8)}>Back</Button>: null}
                    </>
                :null}

            </div>
        )

    }
    else{
        return <p>please log in</p>
    }
}


