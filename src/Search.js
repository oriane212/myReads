import React from 'react';
import { Link } from 'react-router-dom';
import BookItem from './BookItem';
import * as BooksAPI from './BooksAPI';
import { Glyphicon } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { Nav } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';


/* Search component, allows user to search for and add books from the BooksAPI to their shelf collection */
class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results: []
        }
        this.replaceResultsMatchingShelfCollection = this.replaceResultsMatchingShelfCollection.bind(this);
    }

    /* updates query state and calls results to update */
    updateQuery(query) {
        this.setState({
            query: query
        })
        this.updateResults(query);
    }

    /* updates state of results using BooksAPI search method */
    updateResults(query) {
        if (query) {
            let queryArray = query.split(' ');

            // for query of 2+ words, search each term separately and combine results
            if (queryArray.length > 1 && (queryArray[queryArray.length-1] !== '')) {
                let promises = [];
                queryArray.forEach((searchTerm) => {
                    let eachPromise = (
                        BooksAPI.search(searchTerm)
                            .then((response) => {
                                if (response != null && response.error == null) {
                                    return response;
                                } else {
                                    return [];
                                }
                            }).catch((error) => {
                                console.log(`Error with search: ${error}`);
                            })
                    )
                    promises.push(eachPromise);
                })
                Promise.all(promises).then((values) => {
                    console.log(values);
                    let response_combined = [];
                    values.forEach((value) => {
                        response_combined = response_combined.concat(value);
                    })
                    this.setState({
                        results: response_combined
                    })
                })
            } else {
                // for 1-word query, search the term entered
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
            // set state of results to empty if query state is empty
        } else {
            this.setState({
                results: []
            })
        }
    }

    /* Finds and replaces book objects in search results with matching book objects from shelf collection (this.props.shelfCollection). 
        * This function is necessary for keeping the state of search results in sync with any updates to the state of books on shelves, rendering accurate dropdown menu changes for each book result
    */
    replaceResultsMatchingShelfCollection() {
        let results_modified = this.state.results;
        results_modified.forEach((bookObjA, index) => {
            this.props.shelfCollection.forEach((bookObjB) => {
                // use book's id property to check for match
                if (bookObjB.id === bookObjA.id) {
                    results_modified[index] = bookObjB;
                }
            })
        })
        return results_modified;
    }

    /* renders Search component */
    render() {
        // initialize array to store BookItem components
        let bookresults = [];

        if (this.state.results) {
            if (this.state.results.length !== 0) {

                // replace results with matching books from shelf collection
                const results_modified = this.replaceResultsMatchingShelfCollection();

                // create and store BookItem component to render
                results_modified.forEach((book) => {
                    bookresults.push(
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