import { Link } from 'react-router-dom'
import { Card, Image } from 'semantic-ui-react'

export default function BackendBookCard({book, style}){
    if (book){
        return(
            <Card style={{textAlign: 'center', style}}>
                <Image size="small" src={ book.image_url ? book.image_url: null }wrapped ui={false} />
                <Card.Content>
                <Card.Header>
                    {book.title ? <Link to={`/bookpage/${book.api_id}`}>{book.title.slice(0,50)} </Link>:null}
                </Card.Header>
                <Card.Meta>
                    {book.subtitle? book.subtitle.slice(0,50): null}
                </Card.Meta>
                <Card.Description>
                    <span className='date'>{book.authors ? book.authors: null}</span>
                </Card.Description>
                </Card.Content>
            </Card>
        )
    }
    else{
        return (null)
    }
    
}