import { Card, Button } from 'semantic-ui-react'
import BackEndBookCard from '../BookIndex/BackEndBookCard'
import React, { useState } from "react"

export default function SponsorList({allWaitings, user, savedBooks}){
    
    let sponsoredWaitings = []
    let sponsoredMapped = []

    const [sponsoredIndex, setSponsoredIndex] = useState(0)

    if (allWaitings.length > 0){
        sponsoredWaitings = allWaitings.filter(waiting=>waiting.sponsor_id === user.id)
        if (sponsoredWaitings.length > 0){
            let arrTwo = []
            arrTwo.push(sponsoredWaitings[0])
            for (let i=1;i < sponsoredWaitings.length;i++){
                if (arrTwo.find(elem=>elem.book_id===sponsoredWaitings[i].book_id))
                {
                    
                }
                else{
                    arrTwo.push(sponsoredWaitings[i])
                }
            }
            sponsoredMapped = arrTwo.map(waiting=>{ //create JSX of books
                return (<BackEndBookCard book={savedBooks.find(savedBook => savedBook.id === waiting.book_id)}/>)
            })
            // console.log(sponsoredMapped)
        }
    }    
    return (
            <>
                <div className="userpage-book-display">
                    <Card.Group itemsPerRow={8}>
                        {sponsoredMapped.slice(sponsoredIndex, sponsoredIndex+8)}  
                    </Card.Group>
                </div>

                <Button className="next-back-button"  onClick={()=>setSponsoredIndex(sponsoredIndex+8)}>Next</Button>
                {sponsoredIndex > 0 ? <Button className="next-back-button"  onClick={()=>setSponsoredIndex(sponsoredIndex-8)}>Back</Button> : null}
            </>
            )
}