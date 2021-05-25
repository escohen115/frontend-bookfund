import {useState } from "react";
import ReactStars from 'react-stars'
import { Button, Form } from 'semantic-ui-react'

export default function ReviewForm ({user, book, setSavedBooks, setWaitlistRequest, 
    waitlistRequest, waitListRequestAndStoreInDBRequest, backEndBook, setBackEndBook, storeInDB}){

    
    const [formState, setFormState] = useState({
        text: "",
        rating: 0
    })

    function handleChange(e){    
        if (user){
            storeInDB()
            setFormState({
                user_id: user.id, 
                book_id: book.id,
                ...formState,
                [e.target.name] : e.target.value
            })
        }
        else{
            debugger
            setFormState({})
            alert("Please sign in to leave a review.")
        }
    }

    function ratingChanged(e){
         if (user){
            storeInDB()
            setFormState({
                ...formState,
                rating: e
            })
        }
        else{
            setFormState({})
            alert("Please sign in to leave a rating.")
        }
    }

    function handleSubmit(e){
        e.preventDefault()
        if (formState.text.length < 100){
            alert("Please leave a review with more than 100 characters.")
        }
        if (formState.text.length > 100){
            let confObj = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formState),
                }

            fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews`, confObj)
            .then(data=>{
                setWaitlistRequest(!waitlistRequest)
                setBackEndBook(true)
                fetch(`${process.env.REACT_APP_API_BASE_URL}/books`)
                .then(response=>response.json())
                .then(data=>{setSavedBooks(data)})
            })
            
        }
    }

    return (
    <div>
        <h3>Leave A Review</h3>
        <ReactStars
            className="react-stars"
            count={5}
            onChange={ratingChanged}
            size={20}
            color2={'#ffd700'} 
            value={formState.rating}
            name="rating"/>
            
        <Form reply onSubmit={e=>handleSubmit(e)}>
            <Form.TextArea 
                value={formState.text}
                name="text"             
                rows={3}
                cols={25}
                onChange={e=>handleChange(e)}/>
            <Button type='submit' content='Add Review' labelPosition='left' icon='edit' primary />
        </Form>
        
    </div> 
    )
    
}
