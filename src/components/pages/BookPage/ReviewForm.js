import {useState } from "react";
import ReactStars from 'react-stars'
import { Button, Comment, Form, Header } from 'semantic-ui-react'

export default function ReviewForm ({user, book, setSavedBooks, setWaitlistRequest, waitlistRequest, waitListRequestAndStoreInDBRequest, backEndBook, setBackEndBook}){

    
    const [formState, setFormState] = useState({
        text: "",
        rating: 0
    })

    function handleChange(e){    
        if (user && backEndBook){
            setFormState({
                user_id: user.id, 
                book_id: book.id,
                ...formState,
                [e.target.name] : e.target.value
            })
        }
        else{
            setFormState({})
            alert("Please sign in to leave a review.")
        }
    }

    function ratingChanged(e){
         if (user && backEndBook){
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
            fetch('http://localhost:3000/reviews', confObj)
            .then(data=>{
                setWaitlistRequest(!waitlistRequest)
                setBackEndBook(true)
                fetch(`http://localhost:3000/books`)
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
{/* 
        <form id="review-form" onSubmit={e=>handleSubmit(e)} >
            <textarea   
                value={formState.text}
                name="text"             
                rows={3}
                cols={25}
                onChange={e=>handleChange(e)}
            />
            <button type='submit'> Submit </button>
        </form> */}

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
{/* {formState.text.length < 100 ? (
<p style={{ color: "red" }}>Please leave a review with more than 100 characters</p>
) : null} */}