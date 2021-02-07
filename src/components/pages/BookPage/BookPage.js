import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SponsorForm from './SponsorForm'

export default function BookPage({setSavedBooks, savedBooks, user}){

    const [book, setBook] = useState ({})
    const [backEndBook, setBackEndBook] = useState(false)
    const [waitlistRequest, setWaitlistRequest] = useState(false)
    const [toggleSponsorForm, setToggleSponsorForm] = useState(false)
    const [bookId, setBookId] = useState(0)
    const params = useParams()
    let waitingsMapped = null

    
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
    },[waitlistRequest])


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
                body: JSON.stringify({user_id: user.id, book_id: bookId}),
            }
            fetch('http://localhost:3000/waitings', confObj)
            .then(setBackEndBook(true),setWaitlistRequest(!waitlistRequest))
            })
        }
        else{
            alert('Please sign in to wait for a book')
        }
    }

    if (backEndBook){
        waitingsMapped = book.waitings.map(waiting=>{
            return<li>{waiting.user.username}</li>
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

            <p>Waitlist:</p>

            <ol>{ backEndBook ? waitingsMapped: "false"} </ol>

            <button onClick={waitListRequestAndStoreInDBRequest}>Jump on the Waitlist for this book</button>
            <button onClick={handleToggleRequest}> Sponsor this Book</button>
            {toggleSponsorForm ? <SponsorForm waitingsMapped={waitingsMapped} book={book}/> : null}

        </>
    )

}