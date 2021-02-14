import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SponsorForm from './SponsorForm'
import ReviewForm from './ReviewForm'
import BookCard from '../BookIndex/BookCard'
import { Card } from 'semantic-ui-react'


export default function BookPage({setSavedBooks, savedBooks, user, setUser, reviewLeft}){
 
    const [book, setBook] = useState ({})
    const [backEndBook, setBackEndBook] = useState(false)
    const [waitlistRequest, setWaitlistRequest] = useState(false)
    const [toggleSponsorForm, setToggleSponsorForm] = useState(false)
    const [booksFromSearch, setBooksFromSearch] = useState([])
    const params = useParams()
    const [bookId, setBookId] = useState(0)
    // const [buyLink, setBuyLink] = useState('')

    let waitingsMapped = null
    let waitingsFulfilledMapped = null
    let reviewsMapped = null
    let booksMapped = []
    // let linkedBookTest = null
    // let linkedBook = false
    
    function stripHtml(html){
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    // useEffect(()=>{
    //     if (book.title){
    //         let title = book.title.split(' ').join('+')
    //         fetch(`http://localhost:3000/books/scrape/${title}`)
    //         .then(response=>response.json())
    //         .then(data=>console.log(data))
    //     }

    // },[book])

    useEffect(()=>{

        // linkedBookTest = savedBooks.find(book=>book.api_id===params.id)
        // if (!linkedBookTest)
        // {
        //     linkedBook = true
        // }

        fetch(`http://localhost:3000/books`)
        .then(response=>response.json())
        .then(data=>{

            let foundBook = null
            foundBook = data.find(book=>book.api_id===params.id)
            setBook(foundBook)

            if (foundBook){
                setBookId (foundBook.id)
                setBackEndBook(true)
            }
            if (!foundBook){
                fetch(`https://www.googleapis.com/books/v1/volumes/${params.id}`)
                .then(response => response.json())
                .then(data=>{
                    let title = ""
                    let subtitle = ""
                    let authors = [""]
                    let publisher = ""
                    let publishedDate = ""
                    let description = ""
                    let image_url = ""
                    if (data.volumeInfo.title){
                        title = data.volumeInfo.title
                    }
                    if (data.volumeInfo.authors){
                        authors = data.volumeInfo.authors
                    }
                    if (data.volumeInfo.subtitle){
                        subtitle = data.volumeInfo.subtitle
                    }
                    if (data.volumeInfo.publisher){
                        publisher = data.volumeInfo.publisher
                    }
                    if (data.volumeInfo.publishedDate){
                        publishedDate = data.volumeInfo.publishedDate
                    }
                    if (data.volumeInfo.description){
                        description = data.volumeInfo.description
                    }
                    if (data.volumeInfo.imageLinks){
                        image_url = data.volumeInfo.imageLinks.thumbnail
                    }
                    setBook({
                        title: title, 
                        subtitle: subtitle, 
                        authors: authors.join(", "), 
                        publisher: publisher, 
                        publishedDate: publishedDate, 
                        description: stripHtml(description),
                        image_url: image_url, 
                        api_id: data.id, 
                        waitings: [],
                        reviews: []
                    })
                })
            }
        })
    },[waitlistRequest, backEndBook, params.id])

    useEffect(()=>{
        if (book){
            if (book.title){
                let searchTerms = book.title.split(" ").pop()
                fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=3`)
                .then(response=>response.json())
                .then(data=>{
                    setBooksFromSearch(data.items)
                })
            }
        }
    },[book])

   

    function waitListRequestAndStoreInDBRequest (){
        if (user){
            let confObj = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            }
            fetch('http://localhost:3000/books', confObj)
            .then(response=>response.json())
            .then(data=>{
                setBook(data)
                setBookId(data.id)
                let bookIdea = data.id
                let confObj = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({user_id: user.id, book_id: bookIdea, fulfilled: false}),
                }
                fetch('http://localhost:3000/waitings', confObj)
                .then(response=>response.json())
                .then(data=>{                  
                    setBackEndBook(true)
                    setWaitlistRequest(!waitlistRequest)
                    if (data.error){
                        alert(`${data.error}`)
                    }
                    else{
                        fetch(`http://localhost:3000/users/${user.id}`)
                        .then(response=>response.json())
                        .then(data=>setUser(data))
                
                        fetch(`http://localhost:3000/books`)
                        .then(response=>response.json())
                        .then(data=>setSavedBooks(data))

                    }
                })
            })
        }

        else{
            alert('Please sign in to join a waitlist.')
        }
    }

    if (booksFromSearch.length > 0){
         booksMapped = booksFromSearch.map(book=>{
            return(
                <BookCard book ={book}/>
            )
        })
    }
    

    if (backEndBook === true && book){

            waitingsMapped = book.waitings.map(waiting=>{
                if (waiting.fulfilled !== true){
                    return<li><Link to={`/otheruserpage/${waiting.user.id}`}>{waiting.user.username}</Link></li>
                }
            })
        
        waitingsFulfilledMapped = book.waitings.map(waiting=>{
            if (waiting.fulfilled === true){
                return<li><Link to={`/otheruserpage/${waiting.user.id}`}>{waiting.user.username}</Link></li>
            }
        })

        reviewsMapped = book.reviews.map(review=>{  
            if (user){
                return(
                    <li>
                        {review.text} - {review.rating} stars - <Link to={`/otheruserpage/${review.user.id}`}>{review.user.username}</Link> 
                
                        {review.user.id === user.id ? <button id={review.id} onClick={e=>handleCommentDelete(e)}>X</button> :null}
                    </li>
                )   
            }
            else{
                return(
                    <li>
                        
                        {review.text} - {review.rating} stars - <Link to={`/otheruserpage/${review.user.id}`}>{review.user.username}</Link> 
                        
                    </li>
                )   
                    
            }
        })
        
    }

    function handleCommentDelete(e){
        let reviewId = parseInt(e.target.id)
        let confObj = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        fetch(`http://localhost:3000/reviews/${reviewId}`, confObj)
        .then(data=>setWaitlistRequest(!waitlistRequest))

    }

    function handleToggleRequest(){
        if (user){
        setToggleSponsorForm(!toggleSponsorForm)
        }
        else{
        alert("Please log in to Sponsor")
        }
    }

    
    return(
        <div className="bookpage">
            <div className="book-info">
                <img src={ book ? book.image_url: "N/A" }></img>

                {/* <button onClick={handleScrapeRequest}>Scrape</button> */}

                <h2>{book? book.title: "N/A"}</h2>
                <h3>{book? book.subtitle: "N/A"}</h3>
                <p>by: {book? book.authors: "N/A"} ({book? book.publishedDate: "N/A"}) </p>
                <p>Publishing House: {book? book.publisher: "N/A"}</p>
                <p>Description: {book? book.description: "N/A"} </p>
                
                
            </div>
            

            
        { backEndBook && book ?
        <>
            <div className="reviews">
                <p>Reviews:</p>
                {reviewsMapped.length > 0 ? 
                    <ol > {reviewsMapped} </ol> 
                : "No one has reviewed this book yet. Be the first!"} 
                <ReviewForm 
                user={user} 
                book={book} 
                waitlistRequest={waitlistRequest} 
                setWaitlistRequest={setWaitlistRequest}
                backEndBook={backEndBook}
                setBackEndBook={setBackEndBook}
                setSavedBooks={setSavedBooks}
                waitListRequestAndStoreInDBRequest={waitListRequestAndStoreInDBRequest}/>
            </div>

            <div className="bookpage-sponsor-list">
                <p>Users who have received this book</p>
                {waitingsFulfilledMapped.length > 0 ? <ol> {waitingsFulfilledMapped}  </ol>: "No one has received this book yet. Join the waitlist to be the first!"}
                    <button onClick={handleToggleRequest}> Sponsor this Book</button>
                    {toggleSponsorForm ? 
                        <SponsorForm 
                            waitingsMapped={waitingsMapped} 
                            book={book} 
                            user={user}
                            setUser={setUser}
                            waitlistRequest={waitlistRequest}
                            setWaitlistRequest={setWaitlistRequest}
                            setBackEndBook={setBackEndBook}
                            backEndBook={backEndBook}
                        /> 
                    : null}
            </div>

            <div className= "bookpage-waiting-list">
                <p>Waitlist:</p>
                <ol>{ waitingsMapped.length > 0 ? waitingsMapped: "No one is currently waiting for this book. Be the first!"} </ol>
                <button onClick={waitListRequestAndStoreInDBRequest}>Jump on the Waitlist for this book</button>
            </div>
           
            </>
        : null
        }

        <div className = "similar-books">
            {booksFromSearch.length > 0 ? 
                <Card.Group itemsPerRow={3}>
                    {booksMapped}  
                </Card.Group>
            : null}
        </div>

        </div>
    )

}










