import {useState } from "react";

export default function SponsorForm({waitingsMapped, book, user, waitlistRequest, setWaitlistRequest, setBackEndBook, backEndBook}){
    

    const[number, setNumber] = useState(0)


    function handleSponsorSubmission(e){

        e.preventDefault()
        let confObj = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({num_books_funded: e.target.number.value, sponsor_id: user.id })
        }
        fetch(`http://localhost:3000/waitings/sponsor/${book.id}`, confObj)
        .then(response=>response.json())
        .then(data=>{
            setWaitlistRequest(!waitlistRequest)
        })
   

    }

        return (
            <form className="signup" onSubmit={e=>handleSponsorSubmission(e)} >
                <label>Number of copies I'd like to sponsor:</label>
                    <input type="number" name="number" value={number} onChange={e=>setNumber(e.target.value)}/>
                    {number > waitingsMapped.length ? (
                        <p style={{ color: "red" }}>Please enter a number smaller than the waitlist total</p>
                    ) : null}
                    <input type="submit" value="Sponsor" className="button"/>
            </form>
        )

    }
    