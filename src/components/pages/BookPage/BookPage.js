import { useEffect, useState } from "react";
import { useParams, Link,  } from "react-router-dom";
import SponsorForm from './SponsorForm'
import ReviewForm from './ReviewForm'
import BookCard from '../BookIndex/BookCard'
import { Card, Button, Image } from 'semantic-ui-react'
import ReactStars from 'react-stars'

export default function BookPage({setSavedBooks, savedBooks, user, setUser, reviewLeft}){
 
    const [book, setBook] = useState ({})
    const [backEndBook, setBackEndBook] = useState(false)
    const [waitlistRequest, setWaitlistRequest] = useState(false)
    const [toggleSponsorForm, setToggleSponsorForm] = useState(false)
    const [booksFromSearch, setBooksFromSearch] = useState([])
    const params = useParams()
    const [bookId, setBookId] = useState(0)
    const[similarIndex, setSimilarIndex] = useState(0)
    const [users, setUsers] = useState([])

    let waitingsMapped = null
    let waitingsFulfilledMapped = 0
    let reviewsMapped = null
    let booksMapped = []
    let averageRating = 0
    let sponsorsMapped=[]

    function stripHtml(html){
        let tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_BASE_URL}/books`)
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

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users`)
        .then(response=>response.json())
        .then(data=>setUsers(data))

    },[waitlistRequest, backEndBook, params.id, bookId])

    useEffect(()=>{
        if (book){
            if (book.title){
                let searchTerms = book.title.split(" ").pop()
                fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=20`)
                .then(response=>response.json())
                .then(data=>{
                    setBooksFromSearch(data.items)
                })
            }
        }
    },[book])

    function storeInDB(){
        if (user){
            let confObj = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            }
            fetch(`${process.env.REACT_APP_API_BASE_URL}/books`, confObj)
            .then(response=>response.json())
            .then(data=>{
                setBook(data)
                setBookId(data.id)
                setBackEndBook(true)
                setWaitlistRequest(!waitlistRequest)
            })
        }
        else{
            alert('Please sign in to leave a review.')
        }
    }


   

    function waitListRequestAndStoreInDBRequest (){
        if (user){
            let confObj = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            }
            fetch(`${process.env.REACT_APP_API_BASE_URL}/books`, confObj)
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
                fetch(`${process.env.REACT_APP_API_BASE_URL}/waitings`, confObj)
                .then(response=>response.json())
                .then(data=>{                  
                    setBackEndBook(true)
                    setWaitlistRequest(!waitlistRequest)
                    if (data.error){
                        alert(`${data.error}`)
                    }
                    // else{
                    //     fetch(`${process.env.REACT_APP_API_BASE_URL}/books`)
                    //     .then(response=>response.json())
                    //     .then(data=>setSavedBooks(data))
                    // }
                })
            })
        }

        else{
            alert('Please sign in to join a waitlist.')
        }
    }

    if (booksFromSearch.length > 0){
         booksMapped = booksFromSearch.slice(similarIndex, similarIndex+3).map(book=>{
            return(
                <BookCard book = {book}/>
            )
        })
    }
   
    

    if (backEndBook === true && book){
         if (users.length > 0){
            let sponsorsFiltered = book.waitings.filter(waiting=>waiting.fulfilled===true)
            let arr = []
            sponsorsMapped = sponsorsFiltered.map(waiting=>{
                let x = sponsorsFiltered.filter(wait=>wait.sponsor_id===waiting.sponsor_id).length

                if (arr.find(elem=>elem===waiting.sponsor_id)){
                    return null
                }
                else{
                arr.push(waiting.sponsor_id)
                    return(
                    <li>
                        <Image src={users.find(user=>user.id===waiting.sponsor_id).profile_pic  ? users.find(user=>user.id===waiting.sponsor_id).profile_pic : "https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"} size='mini' circular />
                        <Link to={`/otheruserpage/${waiting.sponsor_id}`}>
                            {users.find(user=>user.id===waiting.sponsor_id).username} 
                        </Link>
                        <div style={{float: 'right'}}> {x} {x === 1 ? " copy" : "copies"}</div>
                    </li>)
                }
            })
            sponsorsMapped = sponsorsMapped.filter(waiting=>waiting!==null)
        }
         
        waitingsMapped = book.waitings.filter(waiting => waiting.fulfilled !== true).map(waiting=>{
            return(
            <li>
                <Image src={waiting.user.profile_pic ? waiting.user.profile_pic : "https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"} size='mini' circular />
                <Link to={`/otheruserpage/${waiting.user.id}`}>
                    {waiting.user.username} {waiting.user.eligible? "(eligible)": "(ineligible)"}
                </Link>
            </li>)
        })
        
       
        
        waitingsFulfilledMapped = book.waitings.filter(waiting => waiting.fulfilled === true).map(waiting=>{
            return(
            <li>
                <Image src={waiting.user.profile_pic ? waiting.user.profile_pic : "https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"} size='mini' circular />
                <Link to={`/otheruserpage/${waiting.user.id}`}>{waiting.user.username}</Link>
            </li>)
        })

        reviewsMapped = book.reviews.map(review=>{  
            
            if (user){
                let reducer = (accumulator, currentValue) => accumulator + currentValue;
                averageRating = book.reviews.map(review=>review.rating).reduce(reducer)/book.reviews.length
                return(
                    <div className="review">
                        <Image src={review.user.profile_pic ? review.user.profile_pic : "https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"} size='mini'  circular/>
                        <Link to={`/otheruserpage/${review.user.id}`}>{review.user.username}</Link> 
                        <ReactStars
                            className="react-stars"
                            count={5}
                            value={review.rating}
                            size={15}
                            color2={'#ffd700'}
                            edit={false}
                            // style={{fontSize: '20px'}}
                        />
                        {review.text} 
                        {review.user.id === user.id ? <Button size='mini' id={review.id} onClick={e=>handleCommentDelete(e)}>Delete</Button> :null}
                    </div>
                )   
            }
            else{
                let reducer = (accumulator, currentValue) => accumulator + currentValue;
                averageRating = book.reviews.map(review=>review.rating).reduce(reducer)/book.reviews.length
                return(
                    <li>
                        <div>
                            <Image src={review.user.profile_pic ? review.user.profile_pic : "https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"} size='mini' circular />
                            <Link to={`/otheruserpage/${review.user.id}`}>{review.user.username}</Link> 
                            <ReactStars
                                className="react-stars"
                                count={5}
                                value={review.rating}
                                size={15}
                                color2={'#ffd700'}
                                edit={false}
                            />
                        </div>
                        {review.text} 
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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/reviews/${reviewId}`, confObj)
        .then(data=>setWaitlistRequest(!waitlistRequest))

    }

    function handleToggleRequest(){
        if (user){
            if (backEndBook){
                setToggleSponsorForm(!toggleSponsorForm)
            }
            else{
                alert("There is no one on the waitlist.")
            }
        }
        else{
        alert("Please log in to Sponsor")
        }
    }

    function similarNext(){
        if (similarIndex < booksFromSearch.length - 2){
            setSimilarIndex(similarIndex+3)
        }
        else{
            alert('No More Books to Display')
        }
    }

    function similarBack(){
        setSimilarIndex(similarIndex-3)
    }

    return(
        <div className="bookpage">
            <div className="book-info">
                <div className="book-info-image">
                    <Image style={{margin: '40px', float:'right'}}size='small-medium'src={ book ? book.image_url: "N/A" }/>
                </div>
                <div className="book-info-info">
                    <h2 style={{marginBottom: '-15px'}}>{book? book.title: "N/A"}</h2>
                    <h3>{book? book.subtitle: "N/A"}</h3>
                    {reviewsMapped ? 
                        <ReactStars
                            className="react-stars"
                            count={5}
                            value={averageRating}
                            size={20}
                            color2={'#ffd700'}
                            edit={false}
                        />
                    : null}
                
                        <b>by:</b> {book? book.authors: "N/A"} ({book? book.publishedDate: "N/A"})
                    
                        <br></br>
                        <b>Publishing House:</b> {book? book.publisher: "N/A"}
                        <br></br>
                        
                        <b>Description:</b> 
                        <p>
                            {book? book.description: "N/A"} 
                        </p>
                </div>


            </div>
            

            { book ? 
            <>
                <div className="reviews">
                    <h3>Reviews</h3>
                    {backEndBook && reviewsMapped.length > 0 ? 
                        <ul className="reviewsUl"> {reviewsMapped} </ul> 
                    : "No one has reviewed this book yet. Be the first!"} 
                    <ReviewForm 
                    storeInDB={storeInDB}
                    user={user} 
                    book={book} 
                    waitlistRequest={waitlistRequest} 
                    setWaitlistRequest={setWaitlistRequest}
                    backEndBook={backEndBook}
                    setBackEndBook={setBackEndBook}
                    setSavedBooks={setSavedBooks}
                    waitListRequestAndStoreInDBRequest={waitListRequestAndStoreInDBRequest}
                    toggleSponsorForm={toggleSponsorForm} 
                    setToggleSponsorForm={setToggleSponsorForm}/>
                </div>

                <div className="bookpage-recipients-list">
                    <h3  style={{textAlign: 'center'}}>Recipients</h3>
                    {backEndBook && waitingsFulfilledMapped.length > 0 ? <ol> {waitingsFulfilledMapped}  </ol>: "No one has received this book yet. Join the waitlist to be the first!"}
                        
                </div>
                <div className= "bookpage-waiting-list">
                    <h3 style={{textAlign: 'center'}}>Waitlist</h3>
                    <ol>{ backEndBook && waitingsMapped.length > 0 ? waitingsMapped: "No one is currently waiting for this book. Be the first!"} </ol>
                    <Button className="waiting-button" onClick={waitListRequestAndStoreInDBRequest}>Join the Waitlist</Button>

                </div>
                <div className= "bookpage-sponsor-list">
                    <h3 style={{textAlign: 'center'}}>Sponsors</h3>
                    <ol>{ backEndBook && sponsorsMapped.length > 0 ? sponsorsMapped: "No one has sponsored this book yet.  Be the first!"} </ol>
                    <Button onClick={handleToggleRequest}> Sponsor this Book</Button>
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
                                setToggleSponsorForm={setToggleSponsorForm}
                                toggleSponsorForm={ toggleSponsorForm}
                            /> 
                        : null}
                </div>
                </>
            : null
            }
            <div className = "similar-books">
                <h3>Similar Books</h3>
                {booksFromSearch.length > 0 ? 
                    <Card.Group itemsPerRow={3}>
                        {booksMapped}  
                    </Card.Group>
                : null}
                
                <div className="buttons-combined">
                    <Button className="next-back-button" onClick={()=>similarNext(similarIndex+3)}>See More</Button>
                    {similarIndex > 0 ? <Button className="next-back-button" onClick={()=>similarBack(similarIndex+3)}>Go Back</Button>: null}
                </div>
            </div>
            
        </div>
    )

}










