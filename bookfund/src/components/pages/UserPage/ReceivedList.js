import { Card, Button } from 'semantic-ui-react'
import React, { useState } from "react"
import BackEndBookCard from '../BookIndex/BackEndBookCard'



export default function ReceivedList({savedBooks, waitingsFulFilledMapped, waitlistMapped}){

    const [index, setIndex] = useState(0)
    let receivedMapped = null

     if (savedBooks.length > 0){
        receivedMapped = waitingsFulFilledMapped.map(waiting=>{ //create JSX of books
            return (<BackEndBookCard book={waiting}/>)
        })
    }

    function handleNextClick(){
        if (index < waitlistMapped.length){
            if (waitlistMapped.length - index > 8){
                setIndex(index+8)
            }
            else{
            setIndex(0)
            }
        }
    }


    return (
        <>
            <div className="userpage-book-display">
                <Card.Group itemsPerRow={8}>
                    {receivedMapped.slice(index, index+8)}  
                </Card.Group>
            </div>
            <Button className="next-back-button"  onClick={()=>handleNextClick(index+8)}>Next</Button>
            {index > 0 ? <Button className="next-back-button"  onClick={()=>setIndex(index-8)}>Back</Button>: null}
        </>
    )
}