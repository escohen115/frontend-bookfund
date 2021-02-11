import React, { useState, useEffect } from "react"
import { Redirect, useHistory } from "react-router-dom";

export default function Search ({setBooksFromSearch, startIndex, setStartIndex}){

    const [searchInput, setSearchInput] = useState("")
    const history = useHistory()

    useEffect(()=>{
        let searchTerms = searchInput.replace(/\s/g, '+')
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=8&startIndex=${startIndex}`)
        .then(response=>response.json())
        .then(data=>{
            setBooksFromSearch(data.items)
            history.push(`/bookindex`)
        })
    },[startIndex])

    function handleSubmit(e){
        e.preventDefault()
        setStartIndex(0)
        let searchTerms = searchInput.replace(/\s/g, '+')
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=8&startIndex=${startIndex}`)
        .then(response=>response.json())
        .then(data=>{
            setBooksFromSearch(data.items)
            history.push(`/bookindex`)
        })
    }

    return(
        <div className="MainNav">
            <form className="search-form" onSubmit={handleSubmit}>
                <label> Search:
                    <input 
                    type="text"
                    onChange={e=>setSearchInput(e.target.value)}
                    value={searchInput}/>
                </label>
                <button type='submit'> Search </button>
            </form>
        </div> 
    )
}