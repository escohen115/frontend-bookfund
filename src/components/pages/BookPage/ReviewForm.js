import {useState } from "react";

export default function ReviewForm ({user, book, setWaitlistRequest, waitlistRequest, backEndBook, setBackEndBook}){

    const [formState, setFormState] = useState({})

    function handleChange(e){
        setFormState({
            user_id: user.id, 
            book_id: book.id,
            ...formState,
            [e.target.name] : e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault()

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
        })
        
    }

    return (
    <div>
        <form id="review-form" onSubmit={e=>handleSubmit(e)} >
            <input type="number" name="rating" onChange={e=>handleChange(e)}/>
            <textarea   
                name="text"             
                rows={3}
                cols={25}
                onChange={e=>handleChange(e)}
            />
            <button type='submit'> Submit </button>
        </form>
        
    </div> 
    )
    
}