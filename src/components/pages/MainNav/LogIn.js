import React,{useEffect, useState} from "react"
import { useHistory } from "react-router-dom";


export default function LogIn ({setUser}){

    let history = useHistory()

    const [formState, setFormState] = useState({})

    function handleChange(e){
        setFormState({
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        let confObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formState),
        }

        fetch('http://localhost:3000/users/login', confObj)
        .then(response=>response.json())
        .then(data=>{
            console.log(data)
            setUser(data)      
            history.push('/userpage')
        })

    }

    return (
        <>
            <div className="form ">
                <form className="signup" onSubmit={(e)=>handleSubmit(e)}>
                    <label>
                        Username:
                        <input type="text" name="username" onChange={(e)=>handleChange(e)}/>
                    </label>
                        <input type="submit" value="Login" className="button"/>
                </form>
            </div>
            
        </>
    )
}