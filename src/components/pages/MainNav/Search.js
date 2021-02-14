import React, { useState, useEffect } from "react"
import { Redirect, useHistory } from "react-router-dom";

import { Input, Menu } from 'semantic-ui-react'

export default function Search ({setBooksFromSearch, startIndex, setStartIndex}){

    const [searchInput, setSearchInput] = useState("")
    const history = useHistory()

    useEffect(()=>{
        let searchTerms = searchInput.replace(/\s/g, '+')
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&maxResults=8&startIndex=${startIndex}`)
        .then(response=>response.json())
        .then(data=>{
            setBooksFromSearch(data.items)
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
        
            <form onSubmit={handleSubmit}>
                <Input icon='search' placeholder='Search...' 
                type="text"
                onChange={e=>setSearchInput(e.target.value)}
                value={searchInput}
                className="search-input"/>
            {/* <button type='submit' className="fa fa-search"> Search </button> */}
            </form>
    )
}