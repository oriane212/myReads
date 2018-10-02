import React from 'react';
import BookShelfItem from './BookShelfItem';
import { Link } from 'react-router-dom';
import { Glyphicon } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

class BookShelves extends React.Component {

    organizeByShelf(books) {
        let booksByShelf = new Map();

        // set up fixed shelves (in order listed above) first
        this.props.fixedShelves.forEach((fixedShelf) => {
            booksByShelf.set(fixedShelf, [])
        });

        // add books to all shelves
        books.forEach(book => {
            if (book.shelf !== 'remove') {
                let shelf = book.shelf;
                if (booksByShelf.get(shelf) != null) {

                    let values = booksByShelf.get(shelf);
                    values.push(book);
                    booksByShelf.set(shelf, values);

                } else {
                    booksByShelf.set(shelf, [book]);
                }
            }

        });

        return booksByShelf;
    }

    render() {

        let bookShelfComponents = [];
        const bookShelves = [];
        const organized = this.organizeByShelf(this.props.books);
        console.log(organized);

        organized.forEach((shelf, shelfKey) => {
            if (shelfKey != null) {
                let object = { shelfKey: shelfKey, shelf: [] };

                if (shelf.length !== 0) {
                    shelf.forEach((book) => {
                        bookShelfComponents.push(
                            <Col xs={6} sm={4} md={3} key={book.id}>
                                <BookShelfItem
                                    book={book}
                                    size='thumbnail'
                                    fixedShelves={this.props.fixedShelves}
                                    onShelfUpdate={this.props.onShelfUpdate}
                                />
                            </Col>
                        )
                    })
                } else {
                    bookShelfComponents.push(
                        <Col xs={6} sm={4} md={3} key={shelfKey}>
                            <p class="info">This shelf currently has no books</p>
                        </Col>
                    )
                }
                object.shelf = bookShelfComponents;
                bookShelves.push(object);
                bookShelfComponents = [];
            }
        })

        console.log(this.props.alert);

        return (
            <div>
                <Link to='/search'>
                    <Navbar>
                        <Nav pullRight>
                            <Glyphicon glyph="search" />
                        </Nav>
                    </Navbar>
                </Link>

                <div className="scrollable-content">
                    {bookShelves.map((bookshelfObj) => (
                        <Grid key={bookshelfObj.shelfKey}>
                            <h3>{
                                bookshelfObj.shelfKey
                                    .split(/(?=[A-Z])/)
                                    .join(' ')
                                    .toUpperCase()
                            }</h3>

                            <Row>{bookshelfObj.shelf}</Row>
                        </Grid>
                    ))}
                </div>
            </div>
        )
    }

}

export default BookShelves;