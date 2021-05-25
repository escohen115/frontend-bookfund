import Search from './Search'
import SignUp from './SignUp'
import LogIn from './LogIn'
import { NavLink, useHistory } from "react-router-dom";
import { Button } from 'semantic-ui-react'

export default function MainNav ({setBooksFromSearch, setUser, user, startIndex, setStartIndex}){

    let history = useHistory()

    function handleSignOut(){
        history.push('/home')
        setUser(null)
    }

    return(

        <div className="main-nav">

            <ul>
                <li className="logo">
                    <NavLink to="/" style={{color:' #333'}}> 
                        <h1 className="logo-text" >bookFun(d)</h1>
                        {/* <h9 className="signed-in">{user ? `signed in as ${user.username}`: "not signed in"} </h9>   */}
                    </NavLink>
                </li>
                <li className= "search-form">
                    <Search 
                    setBooksFromSearch={setBooksFromSearch}
                    startIndex={startIndex}
                    setStartIndex={setStartIndex}
                    />
                </li>
                <div className = "navLinks">
                    
                        {/* {user ? null :<NavLink to="/signup"> SignUp </NavLink> } */}
                        {user ? null : <SignUp user={user} setUser={setUser}/> }
                    
                        
                            {user ? null : <LogIn style={{color: 'inherit'}} user={user} setUser={setUser}/> }
                        
                    
                        
                            {user ? <Button> <NavLink style={{color: 'inherit'}} to="/userpage">  My Page  </NavLink></Button> : null}
                        

                        
                            {user ? <Button onClick={()=>handleSignOut()}>  Sign Out  </Button> : null}
                        

                        <Button>
                            <NavLink style={{color: 'inherit'}} to="/">  Home  </NavLink>
                        </Button>
                    
                </div>
                
            </ul>
        </div>
    )

}