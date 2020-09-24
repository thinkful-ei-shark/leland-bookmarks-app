'use strict';

$(document).ready(function () {
    bookmarks.bindEventListeners();
    bookmarks.render();
    api.getBookmarks()
        .then(items => {
            items.forEach(bookmark => store.addItem(bookmark));
            bookmarks.render();
        })
        .catch(err => console.log(err.message));
});