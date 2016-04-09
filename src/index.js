/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/3/18
 * Description: Entry.
 */

'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import ChapterList from './chapter-list';
import BookList from './book-list';
import Page from './page';
import PageList from './pages-list';
import Notify from './notify';
import Storage from './storage';
import { bindFunctions, stringToColor } from './utils';
import configManager from './config';

import './theme/styles/sky.css';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            chapterListLeft: 100,
            headLineColor: "rgba(0,0,0,0)",
            pageListBackColor: "rgba(0,0,0,0)",
            pageListButtonBackColor: "rgba(0,0,0,0)",
            pageListButtonFontColor: "rgba(0,0,0,0)"
        };
        bindFunctions(
            this,
            [
                "handleChangeBook",
                "reoffsetChapter",
                "handleChangeChapter",
                "handleChangePage",
                "handleShowNotify",
                "changeColor",
                "resize"
            ]
        );
    }

    handleChangeBook(){
        this.refs.chapterList.reload();
    }

    reoffsetChapter(width){
        this.setState({
            chapterListLeft: width + 30
        });
    }

    handleChangeChapter(){
        this.refs.pageList.reload();
        this.changeColor();
    }

    handleChangePage(){
        this.refs.page.reload();
    }

    handleShowNotify(type, message, callbacks){
        this.refs.notify.show(type, message, callbacks);
    }

    changeColor(){
        const config = configManager.getConfig();
        this.setState({
            headLineColor: stringToColor(Storage.nowBook.getNow(), config.chapterNowBackSLO),
            pageListBackColor: stringToColor(Storage.nowBook.getNow(), config.pageListBackSLO),
            pageListButtonBackColor: stringToColor(Storage.nowBook.getNow(), config.pageButtonBackSLO),
            pageListButtonFontColor: stringToColor(Storage.nowBook.getNow(), config.pageButtonFontSLO)
        });
    }

    resize() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize.bind(this));
        this.changeColor();
        this.resize();
    }

    render(){
        const width = this.state.width;
        const height = this.state.height;
        const headHeight = 100;
        this.styles = {
            head: {
                height: headHeight
            },
            content: {
                height: height - headHeight
            },
            bookButtonHeight: 65,
            bookButtonTop: headHeight - 70,
            bookButtonPosition: "absolute",
            bookListMenu: {
                height: 48
            },
            chapterList: {
                width: width - this.state.chapterListLeft,
                left: this.state.chapterListLeft,
                height: 40,
                top: headHeight - 45
            },
            headLine: {
                top: headHeight - 5,
                height: 5,
                backgroundColor: this.state.headLineColor
            },
            pageList: {
                width: 200,
                backgroundColor: this.state.pageListBackColor
            },
            pageListBackground: {
                width: 200
            },
            pageListButton: {
                backgroundColor: this.state.pageListButtonBackColor,
                color: this.state.pageListButtonFontColor
            },
            page: {
                width: width - 200
            }
        };
        return (
            <div>
                <div
                    ref="head"
                    className="head head-color full-width"
                    style={this.styles.head}
                >
                    <div
                        className="head head-image full"
                    >
                        <Notify
                            ref="notify"
                        />
                        <BookList
                            menuStyle={this.styles.bookListMenu}
                            buttonHeight={this.styles.bookButtonHeight}
                            buttonTop={this.styles.bookButtonTop}
                            buttonPosition={this.styles.bookButtonPosition}
                            handleChangeBook={this.handleChangeBook}
                            reoffsetChapter={this.reoffsetChapter}
                        />
                        <ChapterList
                            ref="chapterList"
                            classBackground="chapter-list absolute"
                            classList=""
                            classSortableList="chapter-sortable-list inner"
                            classSortableItem="chapter-sortable-list-item"
                            classButton="chapter-list-button inner button"
                            style={this.styles.chapterList}
                            layoutMode="horizontal"
                            addButtonLocation="end"
                            handleChangeChapter={this.handleChangeChapter}
                            handleShowNotify={this.handleShowNotify}
                        />
                        <div
                            className="head-line absolute"
                            style={this.styles.headLine}
                        >
                        </div>
                    </div>
                </div>
                <div style={this.styles.content}>
                    <PageList
                        ref="pageList"
                        classBackground="page-list-background  float-left"
                        classList="page-list full-height"
                        classSortableList="page-sortable-list full-width"
                        classSortableItem="page-sortable-list-item"
                        classButton="page-list-button button"
                        style={this.styles.pageListBackground}
                        styleList={this.styles.pageList}
                        styleButton={this.styles.pageListButton}
                        layoutMode="vertical"
                        addButtonLocation="front"
                        handleChangePage={this.handleChangePage}
                        handleShowNotify={this.handleShowNotify}
                    />
                    <Page
                        ref="page"
                        style={this.styles.page}
                    />
                </div>

            </div>
        );
    }
}

ReactDom.render(
    <App/>,
    document.getElementById('react-content')
);