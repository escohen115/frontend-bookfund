import React,{useState} from "react"
import { Button, Modal, Form } from 'semantic-ui-react'
import { useHistory } from "react-router-dom";


export default function SignUp({user, setUser}) {

    let history = useHistory()
    const [open, setOpen] = useState(false)
    const [formState, setFormState] = useState({
            eligible: true
        })

    function handleChange(e){
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        })   
    }

    function handleImage (e){
        e.persist()
        setFormState({
            ...formState,
            [e.target.name]: e.target.files[0]
        })
    }


    function handleSubmit(e){
        e.preventDefault()
        const form = new FormData()

        if (!(formState.username)){
            alert('Please enter a username.')
        }

        form.append("profile_pic", formState.profile_pic)
        form.append("username", formState.username)
        form.append("name", formState.name)
        form.append("bio", formState.bio)
        form.append("email", formState.email)
      
        let confObj = {
            method: 'POST',
            body: (form),
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users`, confObj)
        .then(response=>response.json())
        .then(data=>{
            if (data.error){
                alert("Username must be unique")
                setFormState({})
            }
            else{
                alert(`welcome aboard ${data.username}!`)
                setUser(data)
                setFormState({})
                history.push('/userpage')
            }
        })
    
    }
  
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Sign Up</Button>}
    >
      <Modal.Header>Sign Up</Modal.Header>
      <Modal.Content >
       
        <Form onSubmit={(e) => handleSubmit(e)}>
                    <Form.Field>
                        <label>Username</label>
                        <input placeholder='Username' name="username" onChange={(e)=>handleChange(e)}/>
                    </Form.Field>
    
                    <Form.Input 
                        type="file" 
                        name="profile_pic" 
                        fluid label='Image Upload' 
                        onChange={(e)=>handleImage(e)} 
                    />
                    <Button type='submit' style={{float:'right', marginBottom: '10px'}}>Sign Up</Button>
            </Form>
         
      </Modal.Content>

    </Modal>
  )
}



