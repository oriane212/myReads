import React from 'react';
import BookShelfItem from './BookShelfItem';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Glyphicon } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

class BookShelves extends React.Component {

    constructor(props) {
        super(props);
        // these fixed shelves will not disappear from view when empty
        //this.fixedShelves = ["currentlyReading", "wantToRead", "read"];
    }

    organizeByShelf(books) {
        let booksByShelf = new Map();

        // set up fixed shelves (in order listed above) first
        this.props.fixedShelves.forEach((fixedShelf) => {
            if (fixedShelf !== 'none') {
                booksByShelf.set(fixedShelf, [])
            }
        });

        // add books to all shelves
        books.forEach(book => {
            let shelf = book.shelf;
            if (booksByShelf.get(shelf) != null) {


                let values = booksByShelf.get(shelf);
                values.push(book);
                booksByShelf.set(shelf, values);


            } else {
                booksByShelf.set(shelf, [book]);
            }
        });

        return booksByShelf;
    }

    render() {

        let bookShelfComponents = [];
        const bookShelves = [];
        const organized = this.organizeByShelf(this.props.books);
        console.log(organized);
        // store shelf names for dynamically creating select menu
        /*
        const shelves = [];
        for (let key of organized.keys()) {
            shelves.push(key);
        }*/

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
                        <div key={shelfKey}>
                            <p>This shelf currently has no books</p>
                        </div>
                    )
                }
                // TODO: grab 3 book components at time and create a row for each

                object.shelf = bookShelfComponents;
                bookShelves.push(object);
                bookShelfComponents = [];

            }

        })

        return (
            <div>
                <Link to='/search'>
                    <Navbar>
                        <Nav pullRight>
                            <Glyphicon glyph="search" />
                        </Nav>
                    </Navbar>
                </Link>

                <div>
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