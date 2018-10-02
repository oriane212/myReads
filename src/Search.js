import React from 'react';
import { Link } from 'react-router-dom';
import BookShelfItem from './BookShelfItem';
import * as BooksAPI from './BooksAPI';
import { Glyphicon } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results: []
        }
        this.shelves = this.props.fixedShelves;
    }

    updateQuery(query) {
        this.setState({
            query: query
        })
        this.updateResults(query);

    }

    updateResults(query) {
        if (query) {

            let queryArray = query.split(' ');
            console.log(queryArray);

            if (queryArray.length > 1) {
                let promises = [];

                queryArray.forEach((searchTerm) => {
                    let eachPromise = (
                        BooksAPI.search(searchTerm)
                            .then((response) => {

                                // TODO: handle errors properly with reject?
                                if (response === undefined) {
                                    console.log('undefined');
                                    return
                                } else if (response.error) {
                                    console.log('error');
                                    return

                                } else {
                                    return response;
                                }
                            })
                    )
                    // return something else here?
                    //return response;
                    promises.push(eachPromise);

                })

                Promise.all(promises).then((values) => {
                    console.log(values);
                    let accume = [];
                    values.forEach((value) => {
                        if (value !== undefined) {
                            accume = accume.concat(value);
                        }
                    })
                    this.setState({
                        results: accume
                    })
                })

            } else {
                // do the one-word search below
                BooksAPI.search(query)
                    .then((response) => {
                        if (response.error) {
                            this.setState({
                                results: []
                            })
                        } else {
                            this.setState({
                                results: response
                            })
                        }
                    })
            }

        } else {
            this.setState({
                results: []
            })
        }
    }

    render() {
        console.log("before", this.props.alert);
        let bookresults = [];
        
        if (this.state.results) {

            if (this.state.results.length !== 0) {

                // active dropdown item reflects the updated shelf of the book before it is rendered in bookshelves
                let updatedResponse = this.state.results;
                //let updatedResponse = this.state.results.map((book, index) => {
                updatedResponse.map((book, index) => {
                        //let removedBook = false;
                    //if (book !== this.props.alert) {
                        // check if the book.id exists in my collection of books (this.props.books)
                        this.props.books.forEach((bookOnShelf) => {

                            // if it does, then add a shelf property with the shelf value to that book
                            if (bookOnShelf.id === book.id) {
                                //book.shelf = bookOnShelf.shelf;
                                //updatedResponse.splice(index, 1, bookOnShelf);
                                updatedResponse[index] = bookOnShelf;
                                /*if (this.props.alert.id === book.id) {
                                    removedBook = true;
                                }*/
                                
                            }


                        })

                        bookresults.push(
                            <Col xs={6} sm={4} md={3} key={updatedResponse[index].id}>
                                <BookShelfItem
                                    book={updatedResponse[index]}
                                    size='thumbnail'
                                    fixedShelves={this.props.fixedShelves}
                                    onShelfUpdate={this.props.onShelfUpdate}
                                    //alert={this.props.alert}
                                    //removedBook={removedBook}
                                />
                            </Col>
                        )

                        

                    /*} else {
                        book.shelf = this.props.alert.shelf;
                    }*/


                    /*
                    if (this.props.alert.title === book.title) {
                        console.log('before ', book.shelf);
                        book.shelf = this.props.alert.shelf;
                        console.log('EQUAL titles');
                        console.log('after ', book.shelf);
                        console.log('alert shelf ',this.props.alert.shelf);
                    }*/

                    return updatedResponse; // is this the right thing to return??
                })

                console.log('updating response');
                console.log("after", this.props.alert);

                /*
                updatedResponse.forEach((book) => {
                    bookresults.push(
                        <Col xs={6} sm={4} md={3} key={book.id}>
                            <BookShelfItem
                                book={book}
                                size='thumbnail'
                                fixedShelves={this.props.fixedShelves}
                                onShelfUpdate={this.props.onShelfUpdate}
                                alert={this.props.alert}
                            />
                        </Col>
                    )
                })*/
            }
        }

        return (
            <div>
                <Navbar>
                    <Nav>
                        <Link to='/'>
                            <Glyphicon glyph="menu-left" />
                        </Link>
                    </Nav>
                    <Navbar.Form>
                        <FormControl
                            type="text"
                            placeholder="Enter a book title"
                            value={this.state.query}
                            onChange={(event) => this.updateQuery(event.target.value)}
                        />
                    </Navbar.Form>

                </Navbar>

                <div className="scrollable-content">
                    <Grid>
                        <Row>
                            {bookresults}
                        </Row>
                    </Grid>
                </div>

            </div>
        )
    }

}

export default Search;