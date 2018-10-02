import React from 'react';
import { DropdownButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

class SelectMenu extends React.Component {

    render() {
        let shelves = this.props.shelves;
        let shelfValue = "";
        const menuDivider = 
            (<MenuItem divider />)
        let removeItem = '';

        if (this.props.book.shelf != null) {
            shelfValue = this.props.book.shelf;
            removeItem = (
                <MenuItem 
                    key='remove'
                    eventKey='remove'
                    onSelect={(eventKey) => this.props.onShelfUpdate(this.props.book, eventKey)}
                    //onSelect={(eventKey) => this.props.onRemove(this.props.book, eventKey)}
                >
                    Remove book
                </MenuItem>
            )
        } 

        return (
        
            <DropdownButton
                bsStyle='info'
                bsSize='small'
                title={this.props.buttonType === 'add' ? ' + ' : ' '}
                noCaret={this.props.buttonType === 'add' ? true : false}
                id={this.props.book.id}
                className={(shelfValue !== '') ? 'aqua' : 'blue'}
            >
                <MenuItem header>{this.props.buttonType === 'add' ? 'Add to..' : 'Move to..'}</MenuItem>
                {
                    shelves.map((shelf) => {
                            return (<MenuItem
                                key={shelf}
                                eventKey={shelf}
                                active={(shelf === shelfValue)? true : false}
                                onSelect={(eventKey) => this.props.onShelfUpdate(this.props.book, eventKey)}>
                                { 
                                    shelf
                                        .split(/(?=[A-Z])/)
                                        .join(' ')
                                        .toUpperCase()
                                }
                            </MenuItem>)
                    })
                }

                {removeItem !== '' ? menuDivider : '' }
                {removeItem !== '' ? removeItem : '' }

            </DropdownButton>
        )
    }

}

export default SelectMenu;