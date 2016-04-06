/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/3/20
 * Description: Indexes of pages.
 */

'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import { bindFunctions, stringToColor } from './utils';

if (process.env.BROWSER) {
    require ('./theme/styles/sky.css');
    require ('./theme/styles/books.css');
}

export default class Book extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            text: this.props.name
        };
        bindFunctions(
            this,
            [
                "onChange",
                "onSubmit",
                "onRename",
                "onRemove",
                "onSelect",
                "handleTextChange",
                "enableInput"
            ]
        );
    }

    onChange(event){
        this.setState({
            text: event.target.value
        });
    }

    onSubmit(event){
        event.preventDefault();
        var text = this.state.text;
        if (text.length === 0){
            this.props.handleErrorCannotChange(
                "Can't rename, book must have a non-empty name!"
            );
            this.enableInput();
            return;
        }

        this.handleTextChange();
    }

    onRename(){
        this.props.doMenuOptions(
            "rename",
            this.props.index
        );
    }

    onRemove(){
        this.props.doMenuOptions(
            "remove",
            this.props.index
        );
    }

    onSelect(){
        this.props.doMenuOptions(
            "select",
            this.props.index
        );
    }

    handleTextChange(){
        this.props.handleTextChange(
            this.props.index, this.state.text
        );
    }

    enableInput(){
        ReactDom.findDOMNode(this.refs.text).focus();
    }

    componentDidMount(){
        if (this.props.canInput){
            this.enableInput();
        }
    }

    componentDidUpdate(){
        if (this.props.canInput){
            this.enableInput();
        }
    }

    render() {
        return (
            <div
                className="book"
            >
                <div
                    style={{
                        height: "100%",
                        backgroundColor: stringToColor(this.props.name, 20, 30, 0.8)
                    }}
                >
                    <form
                        className="book-text button float-left"
                        onSubmit={this.onSubmit}
                        onBlur={this.onSubmit}
                        onClick={this.onSelect}
                    >
                        <input
                            ref="text"
                            disabled={!this.props.canInput}
                            type="text"
                            value={this.state.text}
                            className="button"
                            style={{
                                color: stringToColor(this.props.name, 80, 30, 1)
                            }}
                            onChange={this.onChange}
                        />
                    </form>
                    <div
                        className="book-buttons float-left"
                    >
                        <div
                            className="book-button-edit book-button button"
                            onClick={this.onRename}
                        >
                        </div>
                        <div
                            className="book-button-remove book-button button"
                            onClick={this.onRemove}
                        >
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}