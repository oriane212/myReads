import React from 'react';
//{ Component } from '../../../Library/Caches/typescript/2.9/node_modules/@types/react';
import logo from './logo.svg';
import './App.css';
import * as BooksAPI from './BooksAPI';
import BookShelves from './BookShelves';
import Search from './Search';
import { Route } from 'react-router-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
    // this.initialShelves = ['currentlyReading', 'wantToRead', 'read'];
    this.state = {
      books: []
      // shelfFrom: ''
    }
    this.fixedShelves = ["currentlyReading", "wantToRead", "read"];
    this.handleShelfUpdate = this.handleShelfUpdate.bind(this);
  }

  componentDidMount() {
    BooksAPI.getAll().then((response) => {
      this.setState({
        books: response
      })
    })
    //console.log(this.state.books);
  }

  handleShelfUpdate(bookObj, selectedShelf) {
    if (selectedShelf === 'remove') {
      BooksAPI.update(bookObj, selectedShelf)
        .then(() => {
          BooksAPI.getAll()
          .then(response => {
            let removedBook = { ...bookObj };
            removedBook.shelf = null;
            response.push(removedBook);
            this.setState({
              books: response
            })
          }

          )
        }
        )
    } else {
      //console.log('handleShelfUpdate called');
      BooksAPI.update(bookObj, selectedShelf)
        .then(() => {
          BooksAPI.getAll()
          .then(response =>
            this.setState({
              books: response
            })
          )
        }
        )
    }
  }

  render() {

    return (

      <div className="App">

        <header className="App-header">
          <h1 className="App-title">My Reads</h1>
        </header>

        <Route exact path='/' render={() => (
          <BookShelves
            books={this.state.books}
            fixedShelves={this.fixedShelves}
            onShelfUpdate={this.handleShelfUpdate}
          />
        )} />

        <Route exact path='/search' render={() => (
          <Search
            books={this.state.books}
            fixedShelves={this.fixedShelves}
            onShelfUpdate={this.handleShelfUpdate}
          />
        )} />


      </div>

    );
  }
}

export default App;

/*
<img src={logo} className="App-logo" alt="logo" />
*/