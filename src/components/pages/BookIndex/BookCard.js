import {Link} from 'react-router-dom'
import { Card, Icon, Image } from 'semantic-ui-react'

export default function BookCard({book}){
    {/* <img src={ book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail: null }></img>
    <Link to={`/bookpage/${book.id}`}>{book.volumeInfo.title} </Link> */}
    return(
        // <div className="book-card">
                <Card>
                    <Image src={ book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail: null }wrapped ui={false} />
                    <Card.Content>
                    <Card.Header>
                        {book.volumeInfo.title ? <Link to={`/bookpage/${book.id}`}>{book.volumeInfo.title.slice(0,100)} </Link> : null}
                    </Card.Header>
                    <Card.Meta>
                        {book.volumeInfo.subtitle ? book.volumeInfo.subtitle.slice(0,50): null}
                    </Card.Meta>
                    <Card.Description>
                        {book.volumeInfo.authors ? book.volumeInfo.authors[0]: null}
                    </Card.Description>
                    </Card.Content>
                    {/* <Card.Content extra>
                    <a>
                        <Icon name='star' />
                        22 Friends
                    </a>
                    </Card.Content> */}
                </Card>
        // </div>
        )
}