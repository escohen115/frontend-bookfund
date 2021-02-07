import BookCard from './BookCard'

export default function BookIndex ({booksFromSearch}){

    let booksMapped = []

    if (booksFromSearch){
         booksMapped = booksFromSearch.map(book=>{
            return(
                <BookCard book ={book}/>
            )
        })
    }

    return (
        <ul>
        book index
        {booksMapped}  
        </ul>
    )
}