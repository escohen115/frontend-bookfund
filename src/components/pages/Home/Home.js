import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackEndBookCard from '../BookIndex/BackEndBookCard'
import { Card, Button, Image, Icon} from 'semantic-ui-react'

export default function Home(){

    const[books,setBooks] = useState([])
    const[backEndWaitings, setBackEndWaitings] = useState([])
    const[users, setUsers] = useState([])
    const[index, setIndex] = useState(0)

    let waitings = []
    let waitingsMapped = []
    let sponsorsMapped = []
    let topReaders = []
    let topReadersMapped = []
    // console.log(process.env.REACT_APP_API_BASE_URL)
    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_BASE_URL}/books`)
        .then(response=>response.json())
        .then(data=>{setBooks(data)})

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users`)
        .then(response=>response.json())
        .then(data=>{setUsers(data)})
        
        fetch(`${process.env.REACT_APP_API_BASE_URL}/waitings`)
        .then(response=>response.json())
        .then(data=>{setBackEndWaitings(data)})
    },[])

     if (books.length > 0){
        for(let i=0; i< books.length; i++){
            let waitingsFulFilled = books[i].waitings.filter(waitings=>waitings.fulfilled!==false).length
            waitings.push({[waitingsFulFilled]:books[i]})
        }
        waitings.sort(function (a, b){
            return Object.keys(b)[0] - Object.keys(a)[0]
        })
        waitingsMapped = waitings.slice(index, (index+8)).map(waiting=>{
            return (<BackEndBookCard book = {Object.values(waiting)[0]}/>)
        })
    }

    if (backEndWaitings.length > 0){ 
        let sponsoredWaitings = backEndWaitings.filter(waiting=>waiting.fulfilled===true)
        let sponsorAOH=[]
        for (let i=0;i<users.length;i++){
            let userSponsors = sponsoredWaitings.filter(waiting=>waiting.sponsor_id===users[i].id)
            sponsorAOH.push({[userSponsors.length]:users[i]})
        }
        let x = sponsorAOH.sort(function (a, b){
            return Object.keys(b)[0] - Object.keys(a)[0]
        })
        sponsorsMapped = x.slice(0,3).map(sponsor=>{
            return( 
                    <Card>
                        <Card.Header><Link to={`/otheruserpage/${Object.values(sponsor)[0].id}`} > <h4 style={{textAlign:'center'}}>{Object.values(sponsor)[0].username}</h4> </Link></Card.Header>
                            <Card.Content style={{textAlign:'center'}}>
                                <Image style={{margin:'auto'}} src={Object.values(sponsor)[0].profile_pic? Object.values(sponsor)[0].profile_pic: "https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"} size='small' circular />
                            </Card.Content>
                            <Card.Content extra>
                            <Icon name='user' />
                                {Object.keys(sponsor)[0]} sponsors
                            </Card.Content>
                    </Card>

                    
                    
                

                )
        })
    }
    if (users.length > 0){
       topReaders = users.sort(function (a, b){
            return   (b.waitings.filter(waiting=>waiting.fulfilled===true).length) - (a.waitings.filter(waiting=>waiting.fulfilled===true).length) 
        })  
        topReadersMapped = topReaders.slice(0,3).map(reader=>{
            return( 
                    <Card>
                        <Card.Header><Link to={`/otheruserpage/${reader.id}`}> <h4 style={{textAlign:'center'}}>{reader.username} </h4></Link></Card.Header>
                        <Card.Content style={{textAlign:'center'}}>
                            <Image src={reader.profile_pic ? reader.profile_pic : "https://www.xovi.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"} size='small' circular />
                        </Card.Content>
                            <Card.Content extra>
                            <Icon name='book' />
                             {reader.waitings.filter(waiting=>waiting.fulfilled===true).length } Books Read
                        </Card.Content>
                    </Card>
                )
        })
        
    }
    
    return(
        <>
            <div className="home-info">
                <h2 className="who">
                    Who we are
                    
                </h2>
                <p style={{fontSize: '15px'}}>
                    test
                    If you've ever read an impactful book that you'd like to share with others, BookFund is the place for you!
                    <br></br>
                    BookFund is a simple way for users to sponsor books they love and share the knowledge with others. 
                    <br></br>
                    Users can sign up for a book via a waitlist to receive the next sponsored copy of that book. After receiving a book, users must publish a review of the book on the site, as well as enter a two week wait period before they are eligible to receive their next book.
                </p>
            </div>

                <h2 className="pop" >Popular Now</h2>
            <div className="popular-now">
                {waitingsMapped.length >0 ? 
                <Card.Group itemsPerRow={8}>
                    {waitingsMapped}  
                </Card.Group>
                :null} 

            </div>
                <div className="buttons-combined">
                    <Button className="next-back-button"  onClick={()=>setIndex(index+8)}>Next</Button>
                    {index > 0 ? <Button className="next-back-button" onClick={()=>setIndex(index-8)}>Back</Button>: null}
                </div>
            <div style={{display:'flex',marginTop: '50px'}}className="bottom-home">
                 <div className="top-readers-home">

                    <h4>Top Readers:</h4>
                    <Card.Group itemsPerRow={3}>
                        {topReadersMapped.length>0 ? topReadersMapped :null}
                    </Card.Group>
                </div>

                <div className="top-sponsors-home">
                    <h4>Top Sponsors:</h4>
                    <Card.Group itemsPerRow={3}>
                        {sponsorsMapped.length>0 ? sponsorsMapped :null}
                    </Card.Group>
                </div>                                                
            </div>
        </>
    )
}