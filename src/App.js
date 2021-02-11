import './App.css';
import 'semantic-ui-css/semantic.min.css'
import MainNav from './components/pages/MainNav/MainNav'
import {Route, Switch} from 'react-router-dom'
import React, { useEffect, useState } from "react"
import BookIndex from './components/pages/BookIndex/BookIndex'
import BookPage from './components/pages/BookPage/BookPage'
import Home from './components/pages/Home/Home'
import UserPage from './components/pages/UserPage/UserPage'
import LogIn from  './components/pages/MainNav/LogIn'
import SignUp from './components/pages/MainNav/SignUp'
import OtherUserPage from './components/pages/OtherUserPage/OtherUserPage'
// const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer')

function App() {

  const [booksFromSearch, setBooksFromSearch] = useState([])
  const [user, setUser] = useState(null)
  const [savedBooks, setSavedBooks] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(true)
  const [reviewLeft, setReviewLeft] = useState(false)

  console.log('time left:', timeLeft)
  useEffect(()=>{
    fetch(`http://localhost:3000/books`)
    .then(response=>response.json())
    .then(data=>setSavedBooks(data))
  },[user])

  console.log('timeleft:', timeLeft)
  console.log('reviewLeft:', reviewLeft)

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
          fetch(`http://localhost:3000/users/${user.id}`, confObj)
      }
      if (timeLeft === true || reviewLeft === false){
        let confObj = {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({eligible: false}),
          }
          fetch(`http://localhost:3000/users/${user.id}`, confObj)
      }

    }
  },[])




  return (
    <>
    <MainNav
      setBooksFromSearch={setBooksFromSearch}
      setUser={setUser}
      user={user}
      startIndex={startIndex}
      setStartIndex={setStartIndex}/>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route exact path="/bookindex">
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
          setSavedBooks={setSavedBooks}
        />
        </Route>
        <Route path="/otheruserpage/:id">
          <OtherUserPage savedBooks={savedBooks}/>
        </Route>
        <Route exact path="/userpage">
          <UserPage 
          user={user} 
          savedBooks={savedBooks} 
          timeLeft={timeLeft} 
          setTimeLeft={setTimeLeft}
          reviewLeft={reviewLeft}
          setReviewLeft={setReviewLeft}
        />
        </Route>
        <Route exact path="/login">
          <LogIn 
          setUser={setUser}
          user={user}/>
        </Route>
        <Route exact path="/signup">
          <SignUp 
          setUser={setUser}
          user={user}/>
        </Route>
      </Switch>
    </>
  
  );
}

export default App;
