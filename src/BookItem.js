import React from 'react';
import { Badge } from 'react-bootstrap';
import { Thumbnail } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import SelectMenu from './SelectMenu';
import { Glyphicon } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

/**
 *  BookItem component, provides a Thumbnail component and a Modal component for each book object.
    * Thumbnail includes a book's cover image, title and author.
    * Modal includes more detailed information in addition to what is provided in the Thumbnail. 
**/
class BookItem extends React.Component {

    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            showModal: false,
        };
    }

    /* closes book details modal */
    handleClose() {
        this.setState({ showModal: false });
    }

    /* shows book details modal */
    handleShow() {
        this.setState({ showModal: true });
    }

    /* render BookItem component */
    render() {

        // book author(s)
        let authors = '';
        if (this.props.book.authors) {
            authors =
                (<p>{this.props.book.authors.join(', ')}</p>)
        } else {
            authors = (<p className='info'>No authors listed</p>)
        }

        // book title, full length
        const title_full = this.props.book.title;
        // book title, short
        let title_short = title_full;
        if (title_full.length > 60) {
            title_short = title_full.slice(0, 57) + '...';
        }

        // book categories
        let categories = [];
        if (this.props.book.categories) {
            this.props.book.categories.forEach((category) => {
                categories.push(
                    <Badge key={category}>{category}</Badge>
                )
            })
        }

        // book cover image
        let coverImg = '';
        let imgSrc = null;
        if (this.props.book.imageLinks) {
            imgSrc = this.props.book.imageLinks[this.props.size];
            coverImg = (
                <img
                    src={imgSrc}
                    alt={title_full}
                />
            )
        }

        // SelectMenu component
        const selectMenuComp = (
            <SelectMenu
                buttonType={(this.props.book.shelf != null) ? 'dropdown' : 'add'}
                book={this.props.book}
                shelves={this.props.fixedShelves}
                onShelfUpdate={this.props.onShelfUpdate}
            />
        )

        // BookItem component
        const bookItemComp = (
            <div className="book-item">
                {selectMenuComp}
                <Thumbnail
                    src={imgSrc ? imgSrc : ''}
                    alt={imgSrc ? title_full : ''}
                >
                    <h4>{title_short}</h4>
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

        // Modal component 
        const modalComp = (
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    {selectMenuComp}
                </Modal.Header>
                <Modal.Body>
                    {coverImg}
                    <h3>{title_full}</h3>
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
        )

        return (
            <div>
                {bookItemComp}
                {modalComp}
            </div>
        )
    }
}

export default BookItem;