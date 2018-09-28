import React from 'react';
import { Link } from 'react-router-dom';
import BookShelfItem from './BookShelfItem';
import * as BooksAPI from './BooksAPI';
import SelectMenu from './SelectMenu';
import { Glyphicon } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
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
            //query: query.trim()
            query: query
        })
        //console.log(this.state.query);
        this.updateResults(query);

    }

    updateResults(query) {
        if (query) {

            //const re = /\w+\s/g;
            //let queryArray = query.match(re);
            let queryArray = query.split(' ');
            console.log(queryArray);

            if (queryArray.length > 1) {

                let promises = [];

                queryArray.forEach((searchTerm) => {
                    let eachPromise = (
                        BooksAPI.search(searchTerm)
                            .then((response) => {
                                if (response === undefined) {
                                    return
                                } else if (response.error) {
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

                //console.log(promises);
                Promise.all(promises).then((values) => {
                    console.log(values);
                    let accume = [];
                    values.forEach((value) => {
                        if (value != undefined) {
                            accume = accume.concat(value);
                        }
                    })
                    //if (values) {
                        //let accume = values[0].concat(values[1]);
                        //console.log(accume);

                        this.setState({
                            results: accume
                        })
                    //}

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

        let bookresults = [];
        if (this.state.results) {

            if (this.state.results.length !== 0) {

                let updatedResponse = this.state.results.map((book) => {
                    // check if the book.id exists in my collection of books (this.props.books)
                    this.props.books.forEach((bookOnShelf) => {
                        // if it does, then add a shelf property with the shelf value to that book
                        if (bookOnShelf.id === book.id) {
                            book.shelf = bookOnShelf.shelf; // is this basically the same as not properly using setState?
                        }
                    })
                    return book;
                })


                updatedResponse.forEach((book) => {
                    bookresults.push(
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
            } /*else {
                if (this.state.query) {
                    bookresults = (
                        <div>Sorry, no results for this search</div>
                    )
                }
            }*/
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

                <div>
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

/*
<SelectMenu
                            book={book}
                            shelves={this.shelves}
                            onShelfUpdate={(book, shelf) => {
                                this.props.onShelfUpdate(book, shelf);
                            }}
                        />
                        */