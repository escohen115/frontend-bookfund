import {Link} from 'react-router-dom'

export default function BookCard({book}){
    return(
        <li className="book-card">
            <img src={ book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail: null }></img>
            <Link to={`/bookpage/${book.id}`}>{book.volumeInfo.title} </Link>
        </li>
        )
}