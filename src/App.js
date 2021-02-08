import './App.css';
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


  useEffect(()=>{
    fetch(`http://localhost:3000/books`)
    .then(response=>response.json())
    .then(data=>setSavedBooks(data))
  },[])


  return (
    <>
    <MainNav
      setBooksFromSearch={setBooksFromSearch}
      setUser={setUser}
      user={user}/>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route path="/bookindex">
          <BookIndex booksFromSearch={booksFromSearch}/>
        </Route>
        <Route path="/bookpage/:id">
          <BookPage savedBooks={savedBooks} setSavedBooks={setSavedBooks} user={user} setUser={setUser}/>
        </Route>
        <Route path="/otheruserpage/:id">
          <OtherUserPage />
        </Route>
        <Route exact path="/userpage">
          <UserPage user={user} savedBooks={savedBooks} />
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
