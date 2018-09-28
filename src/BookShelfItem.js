import React from 'react';
import { Badge } from 'react-bootstrap';
import { Thumbnail } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import SelectMenu from './SelectMenu';
import { Glyphicon } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';


class BookShelfItem extends React.Component {

    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    render() {

        let authors = '';
        if (this.props.book.authors) {
            authors =
                (<p>{this.props.book.authors.join(', ')}</p>)
        } else {
            authors = (<p className='info'>No authors listed</p>)
        }

        let title = this.props.book.title;
        if (title.length > 60) {
            title = title.slice(0, 57) + '...';
        }

        let categories = [];
        if (this.props.book.categories) {
            this.props.book.categories.forEach((category) => {
                categories.push(
                    <Badge>{category}</Badge>
                )
            })
        }

        let bookimg2 = '';
        if (this.props.book.imageLinks) {
            bookimg2 = (
                <img
                    src={this.props.book.imageLinks[this.props.size]}
                    alt={this.props.book.title}
                />
            )
        }

        let bookimg = (

            <div className="booktitle">

                <SelectMenu
                    buttonType={(this.props.book.shelf != null) ? 'dropdown' : 'add'} // recently added
                    book={this.props.book}
                    shelves={this.props.fixedShelves}
                    onShelfUpdate={this.props.onShelfUpdate}
                />

                <Thumbnail
                    src={this.props.book.imageLinks ? this.props.book.imageLinks[this.props.size] : ''}
                    alt={this.props.book.imageLinks ? title : ''}
                >
                    <h4>{title}</h4>
                    {authors}

                    <div className='info-link'>
                        <Button bsStyle="link" onClick={this.handleShow}>
                            <Glyphicon glyph='info-sign' />
                            more info
                                </Button>
                    </div>

                </Thumbnail>
            </div>
        )

        return (
            <div>
                {bookimg}

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <SelectMenu
                            buttonType={(this.props.book.shelf != null) ? 'dropdown' : 'add'} // recently added
                            book={this.props.book}
                            shelves={this.props.fixedShelves}
                            onShelfUpdate={this.props.onShelfUpdate}
                        />
                    </Modal.Header>
                    <Modal.Body>
                    
                        {bookimg2}
                        <h3>{this.props.book.title}</h3>
                        <h4>{this.props.book.subtitle}</h4>
                        {authors}
                        {categories}
                       
                        <div>
                            <hr />
                            {this.props.book.description}
                            <hr />
                        </div>

                    </Modal.Body>
                </Modal>


            </div>

        )
    }
}

export default BookShelfItem;