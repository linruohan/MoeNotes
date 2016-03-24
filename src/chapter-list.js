/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/3/20
 * Description: Indexes of pages.
 */

'use strict';

import React from 'react';
import SortableList from './sortable-list';
import Storage from './storage';
import Notify from './notify';

import './theme/styles/sky.css';


class ChapterList extends SortableList {
    constructor(props){
        super(props);
        this.initState(
            "chapter-list",
            Storage.getIndexes()
        );
    }

    refresh(callback){
        this._sortkey ++;
        this.state.indexes = Storage.getIndexes();
        this.setState({}, callback === undefined ?
            () => {this.setScrollbar.bind(this);}
            :
            callback()
        );
    }

    onSort(indexes) {
        Storage.setIndexes(indexes);
        this.refresh();
    }

    remove(index) {
        if(Storage.canNotRemove()){
            this.showNotify(
                "error",
                "Book must have more than one chapter !"
            );
            return;
        }
        Storage.remove(index);
        this.props.handlerChangeChapter();
        this.refresh();
    }

    create(no) {
        this.state.indexes.splice(no, 0, "");
        this._sortkey ++;
        this.doMenuOptions("rename", "");
    }

    rename(index, name){
        if(!Storage.has(index)){
            Storage.create(
                this.state.indexes.indexOf(index),
                name
            );
        }
        else{
            Storage.rename(index, name);
        }
        this.select(name);
    }

    select(index){
        Storage.change(index);
        this.props.handlerChangeChapter();
        this.refresh();
    }

    copy(index){
        this.clipBoard = Storage.getPath(index);
    }

    reload(){
        if(Storage.isEmpty()){
            this.refresh(this.createEnd.bind(this));
        }
        else{
            this.select(Storage.getNow());
        }
    }

    componentDidUpdate(){
        this.resizeSortableList();
    }

    render(){
        return this.renderGen();
    }
}

export default ChapterList;