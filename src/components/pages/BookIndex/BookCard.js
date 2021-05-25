import {Link} from 'react-router-dom'
import { Card, Image } from 'semantic-ui-react'

export default function BookCard({book}){
    return(
        <Card style={{textAlign: 'center'}}>
            <Image 
                size='tiny' 
                src={ book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail: null }wrapped ui={false} 
            />
            <Card.Content>
            <Card.Header>
                {book.volumeInfo.title ? <Link to={`/bookpage/${book.id}`}>{book.volumeInfo.title.slice(0,50)} </Link> : null}
            </Card.Header>
            <Card.Description>
                {book.volumeInfo.authors ? book.volumeInfo.authors[0].slice(0,50): null}
            </Card.Description>
            </Card.Content>
        </Card>
        )
}

