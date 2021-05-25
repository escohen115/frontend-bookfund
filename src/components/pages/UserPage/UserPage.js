import { Button } from 'semantic-ui-react'
import React, { useState, useEffect } from "react"
import { Redirect } from "react-router-dom";
import Timer from './Timer'
import BackEndBookCard from '../BookIndex/BackEndBookCard'
import { Image, Form } from 'semantic-ui-react'
import SponsorList from './SponsorList'
import WaitList from "./WaitList";
import ReceivedList from './ReceivedList'

export default function UserPage({user, savedBooks, timeLeft, setTimeLeft, reviewLeft, setReviewLeft}){

    let waitingsFulFilledMapped = []
    let mostRecent = {}
    let foundBook = null
    let foundReview = null
    let waitlistMapped = 0
    let displayTimer = false
    
    const [allWaitings, setAllWaitings] = useState([])
    const [displayTimerTwo, setDisplayTimerTwo] = useState(true)
    const [editInfo] = useState(false)
    const [formState, setFormState] = useState({})

    
    useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_BASE_URL}/waitings`)
    .then(response=>response.json())
    .then(data=>setAllWaitings(data))
    },[])

    function handleChange(e){
        console.log(e)
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })   
    }

    function handleImage (e){
        e.persist()
        setFormState({
            ...formState,
            [e.target.name]: e.target.files[0]
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        const form = new FormData()

        if (!(formState.username)){
            alert('Please enter a username.')
        }

        form.append("profile_pic", formState.profile_pic)
        form.append("username", formState.username)
        form.append("name", formState.name)
        form.append("bio", formState.bio)
        form.append("email", formState.email)
    
    }
    
    if (user){ 
        if (user.waitings.length < 1){
            // console.log(`setTimeLeft(false)`)
            setTimeLeft(false)
            setReviewLeft(true)
        }

        let waitingsFulfilled = user.waitings.filter(waiting=>waiting.fulfilled===true) //get all fulfilled waitings for a user
        for(let i = 0;i < waitingsFulfilled.length; i++){
            waitingsFulFilledMapped.push(savedBooks.find(saved_book => saved_book.id === waitingsFulfilled[i].book_id)) //create an array of those books by comparing to saved books
        } 
        
        if (waitingsFulfilled.length < 1){
             setReviewLeft(true)
        }
        
        if (waitingsFulfilled.length > 0){
            mostRecent = (waitingsFulfilled.sort(function (a, b){ // find most recent received
                return b.id - a.id
            })[0])
            if (Object.keys(mostRecent).length !== 0){ // if theres not most recent book
                //check mostRecent.waiting date. if no time left between creation and future deadline, setTimeLeft(false), and vice versa
                let creationDate = new Date(parseInt(mostRecent.sponsor_date)+60000).getTime()
                let now = new Date().getTime()

                if (now < creationDate){ // wait period has not passed
                    displayTimer = true
                }
                else
                {
                    displayTimer = false
                    console.log(`setTimeLeft(false)`)
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

        return(
        <div className="userpage"> 

        <div className="userpage-top-half">

             <div className="userpage-eligibility-info" style={{float:'left'}}>
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
                {reviewLeft === false && mostRecent!== null && (user.waitings.length > 0) ? (<div style={{margin:'auto'}} > <h3 >Please leave a review for</h3> <div style={{margin:'auto'}}><BackEndBookCard book={foundBook} style={{margin:'auto'}}/></div> </div>): null}
            </div>
            <div className="userpage-user-info"  >
                <h3>Profile</h3>
                <Image src={user.profile_pic ? user.profile_pic : null} size="small" circular style={{float:'left'}}/>
                    {editInfo ? null :
                    <div style={{float:'left', marginLeft: '50px'}}>
                        <h4 style={{display:'inline'}}>Name: </h4>{user.name !== "undefined"? user.name : null}
                        <br></br>
                        <br></br>
                        <h4 style={{display:'inline'}}>Email: </h4>{user.email !== "undefined" ?  user.email : null}
                        <br></br>
                        <br></br>
                        <h4 style={{display:'inline'}}>Username: </h4>{user.username !== "undefined" ? user.username : null }
                        <br></br>
                        <br></br>
                        <h4 style={{display:'inline'}}>Bio: </h4>{user.bio !== "undefined" ? user.bio : null}
                    </div>
                }

                {editInfo ? 
                <div style={{float:'left', marginLeft: '50px'}}>
                     <Form onSubmit={(e)=>handleSubmit(e)}>
                        <Form.Field>
                            <label>Name</label>
                            <input placeholder='Name' name="name" onChange={(e)=>handleChange(e)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Username</label>
                            <input placeholder='Username' name="username" onChange={(e)=>handleChange(e)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Email</label>
                            <input placeholder='Email' name="email" onChange={(e)=>handleChange(e)}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input placeholder='Password' type="password" />
                        </Form.Field>
                        <Form.Field >
                            <label>Bio</label>
                            <input placeholder='Bio' name="bio" onChange={(e)=>handleChange(e)}/>
                        </Form.Field>
                        <Form.Input 
                        type="file" 
                        name="profile_pic" 
                        fluid label='Image Upload' 
                        onChange={(e)=>handleImage(e)} 
                        />
                    <Button type='submit' style={{float:'right', marginBottom: '10px'}}>Sign Up</Button>
                    </Form>   
                </div>
                    
                : null}

                {/* <Button style={{float:'right', marginRight: '50px'}} onClick={()=>setEditInfo(!editInfo)}> Edit Profile Info </Button> */}
            
            </div>

                





                    
        
        
        </div>
                <h3 className="pop">Waitlist</h3>
        
                <WaitList
                waitlistMapped={waitlistMapped}
                user={user}
                savedBooks={savedBooks}/>


                <h3 className="pop">Received</h3>
                {waitingsFulFilledMapped.length > 0 ? 
                    <ReceivedList
                    waitingsFulFilledMapped={waitingsFulFilledMapped}
                    savedBooks={savedBooks}
                    waitlistMapped={waitlistMapped}/>
                :null}


                <h3 className="pop">Sponsored</h3>
                <SponsorList
                allWaitings={allWaitings}
                savedBooks={savedBooks}
                user={user}/>
            </div>
        )

    }
    else{
        return <>
        Error. Please try again
            <Redirect to ="/bookindex"/>
        </>
    }
}


