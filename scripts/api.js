'use strict';

const api = (function () {

    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/leland';

    const apiData = function (...args) {
        let error;
        return fetch(...args)
            .then(res => {
                if (!res.ok) {
                    error = { code: res.status };
                }
                return res.json();
            })
            .then(data => {
                if (error) {
                    error.message = data.message;
                    return Promise.reject(error);
                }
                return data;
            });
    };


    const getBookmarks = function () {
        return apiData(`${BASE_URL}/bookmarks`);
    };

    const createBookmark = function (title, url, desc, rating) {
        let newBookmark = JSON.stringify(
            {
                title: title,
                url: url,
                desc: desc,
                rating: rating
            });
        return apiData(`${BASE_URL}/bookmarks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: newBookmark
        });
    };

    const removeBookmark = function (id) {
        return apiData(`${BASE_URL}/bookmarks/${id}`, {
            method: 'DELETE'
        });
    };

    return {
        getBookmarks,
        createBookmark,
        removeBookmark
    };

}());