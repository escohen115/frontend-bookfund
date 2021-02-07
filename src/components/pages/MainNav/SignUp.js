import React,{useState} from "react"


export default function SignUp ({user, setUser}){

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

        fetch('http://localhost:3000/users', confObj)
        .then(response=>response.json())
        .then(data=>{
            if (data.error){
                alert("Username must be unique")
                setFormState({})
            }
            else{
                setUser(data)
                setFormState({})
            }
        })
    
    }

    return (

        <div className="form ">

            <form className="signup" onSubmit={(e)=>handleSubmit(e)}>
                <label>
                    Username:
                    <input type="text" name="username" onChange={(e)=>handleChange(e)}/>
                </label>
                    <input type="submit" value="Sign Up" className="button"/>
            </form>
        </div>
    )
}