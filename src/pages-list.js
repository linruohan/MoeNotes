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


class PageList extends SortableList {
    constructor(props){
        super(props);
        this.initState(
            "page-list",
            Storage.getIndexes(Storage.getNow())
        );
    }

    refresh(callback){
        this._sortkey ++;
        this.state.indexes = Storage.getIndexes(Storage.getNow());
        this.setState({}, callback === undefined ?
            () => {this.setScrollbar.bind(this);}
            :
            callback()
        );
    }

    onSort(indexes) {
        Storage.setIndexes(indexes, Storage.getNow());
        this.refresh();
    }

    remove(index) {
        const chapter = Storage.getNow();
        if(Storage.canNotRemove(chapter)){
            this.showNotify(
                "error",
                "Chapter must have more than one page !"
            );
            return;
        }
        Storage.remove(index, chapter);
        this.props.handlerChangePage();
        this.refresh();
    }

    create(no) {
        this.state.indexes.splice(no, 0, "");
        this._sortkey ++;
        this.doMenuOptions("rename", "");
    }

    rename(index, name){
        if(!Storage.has(index, Storage.getNow())){
            Storage.create(
                this.state.indexes.indexOf(index),
                name,
                Storage.getNow()
            );
        }
        else{
            Storage.rename(index, name, Storage.getNow());
        }
        this.select(name);
    }

    select(index){
        Storage.change(index, Storage.getNow());
        this.props.handlerChangePage();
        this.refresh();
    }

    copy(index){
        this.clipBoard = Storage.getPath(index, Storage.getNow());
    }

    reload(){
        if(Storage.isEmpty(Storage.getNow())){
            this.refresh(this.createEnd.bind(this));
        }
        else{
            const chapter = Storage.getNow();
            this.select(Storage.getNow(chapter));
        }
    }

    render(){
        return this.renderGen();
    }
}

export default PageList;