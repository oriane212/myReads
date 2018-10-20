import React from 'react';
import './App.css';
import * as BooksAPI from './BooksAPI';
import BookShelves from './BookShelves';
import Search from './Search';
import { Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

/**
  * App component, contains two routes.
  * The default route '/' provides user with their collection of books (BookShelves component).
  * The '/search' route provides user with Search component.
  * Alert component is provided when user removes a BookItem.
*/
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      removedItem: ''
    }
    this.fixedShelves = ["currentlyReading", "wantToRead", "read"];

    this.handleShelfUpdate = this.handleShelfUpdate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.handleUndoRemove = this.handleUndoRemove.bind(this);
  }

/* When App successfully mounts, get collection of books from BooksAPI that represent books currently on shelves, and set state of books */
  componentDidMount() {
    BooksAPI.getAll().then((response) => {
      this.setState({
        books: response
      })
    })
  }
/* Temporarily stores book item when user removes it from shelves */
  handleRemove(bookObj) {
    this.setState({
      removedItem: bookObj
    })
  };
/* Empties removed item from state */
  handleAlertDismiss() {
    this.setState({
      removedItem: ''
    })
  }
/* On undo, assign removed book item back to its previously selected shelf */
  handleUndoRemove() {
    this.handleShelfUpdate(this.state.removedItem, this.state.removedItem.shelf);
    this.handleAlertDismiss();
  }

/* Updates a book item's shelf assignment by getting updated collection and setting state of books */
  handleShelfUpdate(bookObj, selectedShelf) {
      BooksAPI.update(bookObj, selectedShelf)
        .then(() => {
          BooksAPI.getAll()
            .then(response => {
              // assign book item's shelf to null if book was removed
              if (selectedShelf === 'remove') {
                this.handleRemove(bookObj);
                let removedBook = { ...bookObj };
                removedBook.shelf = null;
                response.push(removedBook);
              }
              this.setState({
                books: response
              })
            })
        })
  }

  /* renders App component */
  render() {

    // Alert component, rendered for a book item when removed from shelves
    let alertComp = '';
    if (this.state.removedItem !== '') {
      alertComp = (
        <Alert onDismiss={this.handleAlertDismiss}>
          <div className='alertMsg'>
            <p>You removed </p>
            <p className='title'>{this.state.removedItem.title}</p>
            <Button bsSize="xsmall" onClick={this.handleUndoRemove}>undo</Button>
            <Button bsSize="xsmall" onClick={this.handleAlertDismiss}>ok</Button>
          </div>
        </Alert>
      )
      
    }

    /* renders either BookShelves or Search component */ 
    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">My Reads</h1>
        </header>

        {alertComp}

        <Route exact path='/' render={() => (
          <BookShelves
            books={this.state.books}
            fixedShelves={this.fixedShelves}
            onShelfUpdate={this.handleShelfUpdate}
          />
        )} />

        <Route exact path='/search' render={() => (
          <Search
            shelfCollection={this.state.books}
            fixedShelves={this.fixedShelves}
            onShelfUpdate={this.handleShelfUpdate}
          />
        )} />

      </div>

    );
  }

}

export default App;