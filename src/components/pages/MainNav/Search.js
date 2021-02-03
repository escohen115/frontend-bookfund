import React, { useState } from "react"
import { Redirect, useHistory } from "react-router-dom";

export default function Search ({setBooksFromSearch}){

    const [searchInput, setSearchInput] = useState("")
    const history = useHistory()

    function handleSubmit(e){
        e.preventDefault()
        let searchTerms = searchInput.replace(/\s/g, '+')
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=40`)
        .then(response=>response.json())
        .then(data=>{
            setBooksFromSearch(data.items)
            history.push(`/bookindex`)
        })
    }

    return(
        <div className="MainNav">
            <form className="search-form" onSubmit={handleSubmit}>
                <input 
                onChange={e=>setSearchInput(e.target.value)}
                value={searchInput}/>
                <button type='submit'> Search </button>
            </form>
        </div> 
    )
}