import BookCard from './BookCard'
import { Card, Button } from 'semantic-ui-react'

export default function BookIndex ({booksFromSearch, startIndex, setStartIndex}){

    let booksMapped = []

    if (booksFromSearch){
         booksMapped = booksFromSearch.map(book=>{

            return(
                <BookCard book ={book}/>
            )
        })
    }
    
    return (
        <div className="book-index" style={{marginTop:'100px'}}>
            <Card.Group itemsPerRow={8}>
                {booksMapped}  
            </Card.Group>
            <div className="buttons-combined" style={{marginTop:'20px'}}>
                <Button className="next-back-button"  onClick={()=>setStartIndex(startIndex+8)}>Next</Button>
                {startIndex > 0 ? <Button className="next-back-button" onClick={()=>setStartIndex(startIndex-8)}>Back</Button>: null}
            </div>     
        </div>
    )
}