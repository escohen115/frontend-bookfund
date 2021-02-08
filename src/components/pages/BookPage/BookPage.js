import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SponsorForm from './SponsorForm'
import ReviewForm from './ReviewForm'


export default function BookPage({setSavedBooks, savedBooks, user, setUser}){

    const [book, setBook] = useState ({})
    const [backEndBook, setBackEndBook] = useState(false)
    const [waitlistRequest, setWaitlistRequest] = useState(false)
    const [toggleSponsorForm, setToggleSponsorForm] = useState(false)
    const [bookId, setBookId] = useState(0)
    const params = useParams()




    let waitingsMapped = null
    let waitingsFulfilledMapped = null
    let reviewsMapped = null
    
    function stripHtml(html){
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    useEffect(()=>{
    fetch(`http://localhost:3000/books`)
    .then(response=>response.json())
    .then(data=>{

        let foundBook = data.find(book=>book.api_id===params.id)
        setBook(foundBook)

        if (foundBook){
            setBookId (foundBook.id )
            setBackEndBook(true)
        }
        if (!foundBook){ 
            fetch(`https://www.googleapis.com/books/v1/volumes/${params.id}`)
            .then(response => response.json())
            .then(data=>{
                setBook({
                    title: data.volumeInfo.title, 
                    subtitle: data.volumeInfo.subtitle, 
                    authors: data.volumeInfo.authors.join(", "), 
                    publisher: data.volumeInfo.publisher, 
                    publishedDate: data.volumeInfo.publishedDate, 
                    description: stripHtml(data.volumeInfo.description),
                    image_url: data.volumeInfo.imageLinks.thumbnail, 
                    api_id: data.id
                })
            })
        }

        })
    },[waitlistRequest, backEndBook, params.id])


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
                let confObj = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user_id: user.id, book_id: bookId, fulfilled: false}),
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
    

    if (backEndBook){
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
                return<li>{review.text} - <Link to={`/otheruserpage/${review.user.id}`}>{review.user.username}</Link> </li>
        })
        
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
        <>
            <img src={ book ? book.image_url: "N/A" }></img>
            <h2>{book? book.title: "N/A"}</h2>
            <h3>{book? book.subtitle: "N/A"}</h3>
            <p>by: {book? book.authors: "N/A"} ({book? book.publishedDate: "N/A"}) </p>
            <p>Publishing House: {book? book.publisher: "N/A"}</p>
            <p>Description: {book? book.description: "N/A"} </p>
            <button onClick={waitListRequestAndStoreInDBRequest}>Jump on the Waitlist for this book</button>

            

            
        { backEndBook ?
        <>
            <p>Waitlist:</p>

            <ol>{ waitingsMapped.length > 0 ? waitingsMapped: "No one is currently waiting for this book. Be the first!"} </ol>

            
            <button onClick={handleToggleRequest}> Sponsor this Book</button>
            {toggleSponsorForm ? 
                <SponsorForm 
                    waitingsMapped={waitingsMapped} 
                    book={book} 
                    user={user}
                    waitlistRequest={waitlistRequest}
                    setWaitlistRequest={setWaitlistRequest}
                    setBackEndBook={setBackEndBook}
                    backEndBook={backEndBook}
                /> 
            : null}

            
            <p>Users who have received this book</p>
            {waitingsFulfilledMapped.length > 0 ? <ol> {waitingsFulfilledMapped}  </ol>: "No one has received this book yet. Join the waitlist to be the first!"}

            <p>Reviews:</p>
            {reviewsMapped.length > 0 ? <ol> {reviewsMapped} </ol> : "No one has reviewed this book yet. Be the first!"} 

            <ReviewForm 
                user={user} 
                book={book} 
                waitlistRequest={waitlistRequest} 
                setWaitlistRequest={setWaitlistRequest}
                backEndBook={backEndBook}
                setBackEndBook={setBackEndBook}/>
            </>
        : null
        }

        </>
    )

}










