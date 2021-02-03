import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function BookPage(){

    const[book, setBook] = useState (null)

    const params = useParams()


    useEffect(()=>{
        fetch(`https://www.googleapis.com/books/v1/volumes/${params.id}`)
        .then(response => response.json())
        .then(data=>setBook(data))
    },[])


    return(
        <>
            <img src={ book ? book.volumeInfo.imageLinks.thumbnail: null }></img>
            <h2>{book? book.volumeInfo.title: null}</h2>
            <h3>{book? book.volumeInfo.subtitle: null}</h3>
            <p>by: {book? book.volumeInfo.authors: null} ({book? book.volumeInfo.publishedDate: null}) </p>
            <p>Publishing House: {book? book.volumeInfo.publisher: null}</p>
            <p>Description: {book? book.volumeInfo.description: null}</p>
        </>
    )

}