import './App.css';
import MainNav from './components/pages/MainNav/MainNav'
import {Route, Switch} from 'react-router-dom'
import React, { useState } from "react"
import BookIndex from './components/pages/BookIndex'
import BookPage from './components/pages/BookPage/BookPage'

function App() {

  const [booksFromSearch, setBooksFromSearch] = useState([])
  const [user, setUser] = useState({})


  return (
    <>
    <MainNav
      setBooksFromSearch={setBooksFromSearch}
      setUser={setUser}/>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route path="/bookindex">
          <BookIndex booksFromSearch={booksFromSearch}/>
        </Route>
        <Route path="/bookpage/:id">
          <BookPage />
        </Route>
      </Switch>
    </>
  
  );
}

export default App;
