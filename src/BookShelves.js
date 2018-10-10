import React from 'react';
import BookItem from './BookItem';
import { Glyphicon } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';

/* BookShelves component, provides user with their collection of books organized by shelf */
class BookShelves extends React.Component {

    /* creates a map of books organized by shelf */
    organizeByShelf(books) {
        // instantiates map of shelves to store books
        let booksByShelf = new Map();
        this.props.fixedShelves.forEach((fixedShelf) => {
            booksByShelf.set(fixedShelf, [])
        });

        // adds books to their assigned shelves
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

    /* renders BookShelves component */
    render() {
        // array to store book item components for each shelf
        let bookItemComponents = [];
        // array to store bookItemComponents arrays
        const bookShelves = [];
        // map of organized books
        const organized = this.organizeByShelf(this.props.books);

        // create a BookItem component for each book
        organized.forEach((shelf, shelfKey) => {
            if (shelfKey != null) {
                let bookShelfObj = { shelfKey: shelfKey, collection: [] };
                if (shelf.length !== 0) {
                    shelf.forEach((book) => {
                        bookItemComponents.push(
                            <Col xs={6} sm={4} md={3} key={book.id}>
                                <BookItem
                                    book={book}
                                    size='thumbnail'
                                    fixedShelves={this.props.fixedShelves}
                                    onShelfUpdate={this.props.onShelfUpdate}
                                />
                            </Col>
                        )
                    })
                } else {
                    bookItemComponents.push(
                        <Col xs={6} sm={4} md={3} key={shelfKey}>
                            <p className="info">This shelf currently has no books</p>
                        </Col>
                    )
                }
                bookShelfObj.collection = bookItemComponents;
                bookShelves.push(bookShelfObj);
                bookItemComponents = [];
            }
        })

        return (
            <div>
                
                    <Navbar>
                        <Nav pullRight>
                            <NavItem eventKey={2} href='/search'>
                                <Glyphicon glyph="search" />
                            </NavItem>
                        </Nav>
                    </Navbar>
                

                <div className="scrollable-content">
                    {  
                        bookShelves.map((bookshelfObj) => (
                            <Grid key={bookshelfObj.shelfKey}>
                                <h3>{
                                    bookshelfObj.shelfKey
                                        .split(/(?=[A-Z])/)
                                        .join(' ')
                                        .toUpperCase()
                                }</h3>
                                <Row>{bookshelfObj.collection}</Row>
                            </Grid>
                        ))
                    }
                </div>
            </div>
        )
    }

}

export default BookShelves;