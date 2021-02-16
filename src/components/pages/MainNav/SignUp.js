import React,{useState} from "react"
import { Button, Input, Menu, Header, Image, Modal, Form } from 'semantic-ui-react'
import { NavLink } from "react-router-dom";



function SignUp({user, setUser}) {
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
                alert(`welcome aboard ${data.username}!`)
                setUser(data)
                setFormState({})
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
           <div className="form ">

            <form className="signup" onSubmit={(e)=>handleSubmit(e)}>
                <label>
                    Username:
                    <input type="text" name="username" onChange={(e)=>handleChange(e)}/>
                </label>
                    <input type="submit" value="Sign Up" className="button"/>
            </form>
        </div>
        <Form>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Name' placeholder='First name' />
          <Form.Input fluid label='Username' placeholder='Username' />
          <Form.Input fluid label='Email' placeholder='Email' />
          
        </Form.Group>
        <Form.Group inline>
          <label>Size</label>
          <Form.Radio
            label='Small'
            value='sm'
          />
          <Form.Radio
            label='Medium'
            value='md'
          />
          <Form.Radio
            label='Large'
            value='lg'
          />
        </Form.Group>
        <Form.TextArea label='Bio' placeholder='Tell us more about you...' />
        <Form.Checkbox label='I agree to the Terms and Conditions' />
        <Form.Button>Submit</Form.Button>
      </Form>
        
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Nope
        </Button>
        <Button
          content="Yep, that's me"
          labelPosition='right'
          icon='checkmark'
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default SignUp

