import React from 'react';
import { DropdownButton } from 'react-bootstrap';
import { MenuItem } from 'react-bootstrap';

class SelectMenu extends React.Component {

    render() {
        let shelves = this.props.shelves;
        let shelfValue = "";
        //let shelfString = '';
        const menuDivider = 
            (<MenuItem divider />)
        let removeItem = '';

        if (this.props.book.shelf != null) {
            shelfValue = this.props.book.shelf;
            //shelfString = shelfValue.split(/(?=[A-Z])/).join(' ').toUpperCase();
            removeItem = (
                <MenuItem 
                    key='remove'
                    eventKey='remove'
                    onSelect={(eventKey) => this.props.onShelfUpdate(this.props.book, eventKey)}
                >
                    Remove book
                </MenuItem>
                
            )
            //console.log(shelfValue)
        } /*else {
            // TODO: update the actual book's shelf property? Am I basically forcing state then?
            //shelfValue = 'NONE';
            shelves.push(shelfValue);
        }*/

        return (
            /*<select 
                value={shelfValue} 
                onChange={(event) => 
                    this.props.onShelfUpdate(this.props.book, event.target.value)
                    }>
                    <option value="">Move to...</option>
            {
                shelves.map(shelf => (
                    <option key={shelf} value={shelf}>
                        {shelf
                            .split(/(?=[A-Z])/)
                            .join(' ')
                            .toUpperCase()
                        }
                    </option>
                ))
            }
            </select>*/
            <DropdownButton
                bsStyle='info'
                bsSize='small'
                title={this.props.buttonType === 'add' ? ' + ' : ' '}
                noCaret={this.props.buttonType === 'add' ? true : false}
                //title = ''
                id={this.props.book.title}
                className={(shelfValue !== '') ? 'aqua' : 'blue'}
                /*title={shelfValue
                    .split(/(?=[A-Z])/)
                    .join(' ')
                    .toUpperCase()}*/
            >
                <MenuItem header>{this.props.buttonType === 'add' ? 'Add to..' : 'Move to..'}</MenuItem>
                {
                    shelves.map((shelf) => {
                        //if (shelf === shelfValue) {
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