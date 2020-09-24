'use strict';

const store = (function () {

    const addItem = function (bookmark) {
        bookmark.expanded = false;
        this.bookmarks.push(bookmark);
    };

    const findAndDelete = function (id) {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
    };

    const findById = function (id) {
        this.bookmarks.find(bookmark => bookmark.id === id);
    };

    const error = {
        message: null
    };

    const addErrorToStore = function (errorMessage) {
        error.message = errorMessage;
        console.log(error.message);
    };

    return {
        bookmarks: [],
        isAddingBookmark: false,
        error,
        addItem,
        findById,
        findAndDelete,
        addErrorToStore,
        minRating: 0
    };

}());