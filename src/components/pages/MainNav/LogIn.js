import React,{useEffect, useState} from "react"
import { useHistory } from "react-router-dom";
import { Button, Modal, Form } from 'semantic-ui-react'

export default function LogIn ({setUser, user}){

    let history = useHistory()

    const [open, setOpen] = useState(false)
    const [formState, setFormState] = useState({})

    useEffect(()=>{
        history.push('/userpage')
    },[user, history])

    function handleChange(e){
        setFormState({
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault()
        setOpen(false)
        let confObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formState),
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, confObj)
        .then(response=>response.json())
        .then(data=>{
            // console.log(data)
            setUser(data)      
            history.push('/userpage')
        })

    }

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger = {<Button> Log In </Button>}
        >
        <Modal.Header>Log In</Modal.Header>
            <Modal.Content >
                <div className="form ">
                        <Form onSubmit={(e)=>handleSubmit(e)}>
                            <Form.Field>
                                <label>Username</label>
                                <input placeholder='Username' name="username" onChange={(e)=>handleChange(e)}/>
                                
                            </Form.Field>
                            <Form.Field>
                                <label>Password</label>
                                <input placeholder='Password' type="password" />
                            </Form.Field>
                            <Button type='submit' style={{float:'right', marginBottom: '10px'}}>Login</Button>
                        </Form>
                    </div>
            </Modal.Content>
        </Modal>
        
    )
}

