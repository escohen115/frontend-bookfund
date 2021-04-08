import './App.css';
import 'semantic-ui-css/semantic.min.css'
import MainNav from './components/pages/MainNav/MainNav'
import {Route, Switch, Redirect} from 'react-router-dom'
import React, { useEffect, useState } from "react"
import BookIndex from './components/pages/BookIndex/BookIndex'
import BookPage from './components/pages/BookPage/BookPage'
import Home from './components/pages/Home/Home'
import UserPage from './components/pages/UserPage/UserPage'
import OtherUserPage from './components/pages/OtherUserPage/OtherUserPage'

function App() {

  const [booksFromSearch, setBooksFromSearch] = useState([])
  const [user, setUser] = useState(null)
  const [savedBooks, setSavedBooks] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(true)
  const [reviewLeft, setReviewLeft] = useState(false)

  
  useEffect(()=>{
    setTimeLeft(true)
    setReviewLeft(false)
    fetch(`${process.env.REACT_APP_API_BASE_URL}/books`)
    .then(response=>response.json())
    .then(data=>setSavedBooks(data))
  },[user])


  useEffect(()=>{
    if (user){
      if (timeLeft === false && reviewLeft === true){
        let confObj = {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({eligible: true}),
          }
          fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${user.id}`, confObj)
      }
      if (timeLeft === true || reviewLeft === false){
        let confObj = {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({eligible: false}),
          }
          fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${user.id}`, confObj)
      }
    }
  },[timeLeft, reviewLeft, savedBooks, user])


  return (
    <div className="app">
    <MainNav
      setUser={setUser}
      user={user}
      setBooksFromSearch={setBooksFromSearch}
      startIndex={startIndex}
      setStartIndex={setStartIndex}
    />
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/bookindex">
          <BookIndex 
            booksFromSearch={booksFromSearch}
            startIndex={startIndex}
            setStartIndex={setStartIndex}
          />
        </Route>
        <Route path="/bookpage/:id">
          <BookPage 
          savedBooks={savedBooks} 
          setSavedBooks={setSavedBooks} 
          user={user} 
          setUser={setUser}
          reviewLeft={reviewLeft}
          timeLeft={timeLeft}
          setBooksFromSearch={setBooksFromSearch}
          startIndex={startIndex}
          setStartIndex={setStartIndex}
        />
        </Route>
        <Route path="/otheruserpage/:id">
          <OtherUserPage 
          user={user} 
          savedBooks={savedBooks} 
          timeLeft={timeLeft} 
          setTimeLeft={setTimeLeft}
          reviewLeft={reviewLeft}
          setReviewLeft={setReviewLeft}/>
        </Route>
        <Route exact path="/userpage">
          {user ? 
          <UserPage 
          user={user} 
          savedBooks={savedBooks} 
          timeLeft={timeLeft} 
          setTimeLeft={setTimeLeft}
          reviewLeft={reviewLeft}
          setReviewLeft={setReviewLeft}
          />: <Redirect to = "/home"/>}
          
        </Route>
      </Switch>
    </div>
  
  );
}

export default App;
