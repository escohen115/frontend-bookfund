import {useState } from "react";

export default function ReviewForm ({user, book, setSavedBooks, setWaitlistRequest, waitlistRequest, waitListRequestAndStoreInDBRequest, backEndBook, setBackEndBook}){

    
    const [formState, setFormState] = useState({
        text: ""
    })

    function handleChange(e){
        // waitListRequestAndStoreInDBRequest()
    
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
            alert("please sign in to leave a review")
        }
    }

    function handleSubmit(e){
        e.preventDefault()
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
        <form id="review-form" onSubmit={e=>handleSubmit(e)} >
            <input 
                type="number" 
                name="rating" 
                value={formState.value}
                onChange={e=>handleChange(e)}/>
            <textarea   
                value={formState.text}
                name="text"             
                rows={3}
                cols={25}
                onChange={e=>handleChange(e)}
            />
            {/* {formState.text.length < 100 ? (
            <p style={{ color: "red" }}>Please leave a review with more than 100 characters</p>
            ) : null} */}
            <button type='submit'> Submit </button>
        </form>
        
    </div> 
    )
    
}