import React from 'react';
import './App.css';
import * as BooksAPI from './BooksAPI';
import BookShelves from './BookShelves';
import Search from './Search';
import { Route } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      alert: ''
    }
    this.fixedShelves = ["currentlyReading", "wantToRead", "read"];

    this.handleShelfUpdate = this.handleShelfUpdate.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.handleUndoRemove = this.handleUndoRemove.bind(this);
  }



  componentDidMount() {
    BooksAPI.getAll().then((response) => {
      this.setState({
        books: response
      })
    })
  }

  handleAlert(bookObj) {
    this.setState({
      alert: bookObj
    })
  };

  handleAlertDismiss() {
    this.setState({
      alert: ''
    })
  }

  handleUndoRemove() {
    this.handleShelfUpdate(this.state.alert, this.state.alert.shelf);
    this.handleAlertDismiss();
  }

  handleShelfUpdate(bookObj, selectedShelf) {

      BooksAPI.update(bookObj, selectedShelf)
        .then(() => {
          BooksAPI.getAll()
            .then(response => {

              if (selectedShelf === 'remove') {
                this.handleAlert(bookObj);
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

  render() {

    let alertComp = '';

    if (this.state.alert !== '') {
      alertComp = (

        <Alert onDismiss={this.handleAlertDismiss}>
          <div className='alertMsg'>
            <p>You removed </p>
            <p className='title'>{this.state.alert.title}</p>
            <Button bsSize="xsmall" onClick={this.handleUndoRemove}>undo</Button>
            <Button bsSize="xsmall" onClick={this.handleAlertDismiss}>ok</Button>
          </div>
        </Alert>
      )
      
    }

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
            alert={this.state.alert}
          />
        )} />

        <Route exact path='/search' render={() => (
          <Search
            books={this.state.books}
            fixedShelves={this.fixedShelves}
            onShelfUpdate={this.handleShelfUpdate}
            alert={this.state.alert}
          />
        )} />

      </div>

    );
  }

}

export default App;