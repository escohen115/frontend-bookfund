import BookCard from './BookCard'
import { useState } from "react";
import { Card } from 'semantic-ui-react'

export default function BookIndex ({booksFromSearch, startIndex, setStartIndex}){

    const[imageFilter, setImageFilter] = useState(false)

    let booksMapped = []

    if (booksFromSearch){
         booksMapped = booksFromSearch.map(book=>{

            return(
                <BookCard book ={book}/>
            )
        })
    }

    function handleClick(){
        console.log('click')
        
        console.log(startIndex)
    }

    return (
        <div className="book-index">
            {/* <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/> */}
                <Card.Group itemsPerRow={8}>
                    {booksMapped}  
                </Card.Group>
                <button className="next-back-button" onClick={()=>setStartIndex(startIndex+8)}>Next</button>
                {startIndex > 0 ? <button className="next-back-button" onClick={()=>setStartIndex(startIndex-8)}>Back</button> : null}
                
        </div>
    )
}