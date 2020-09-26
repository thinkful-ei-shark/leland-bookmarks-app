'use strict';

const bookmarks = (function () {
   $('main').append(`<p class="error-message"></p>
   <section class="filter" aria-live="polite">
       <select name="Filter by Minimum Rating" id="minimum-rating-select">
           <option value="0">Min. Star Rating (Filter by):</option>
           <option value="1">1 Stars</option>
           <option value="2">2 Stars</option>
           <option value="3">3 Stars</option>
           <option value="4">4 Stars</option>
           <option value="5">5 Stars</option>
       </select>
   </section>
   <section class="add-form" aria-live="polite">

   </section>
   <ul class="my-bookmarks" aria-live="polite"> </ul>`)
    
    function handleAddBookmark() {
        $('.add-form').on('click', '.add-button', function (event) {
            store.isAddingBookmark = true;
            $('.add-button').addClass('hidden');
            render();
        });
    }


    function generateAddBookmarkForm() {
        
        return `
      <form id="add-bookmark">
        <h2>Enter A New Bookmark</h2>
        <div class="labels-inputs">
            <label for="bookmark-title" class="bookmark-title">Bookmark Title</label>
            </br>
            <input type="text" id="bookmark-title" name="title" placeholder="Enter title" class="form-input" required>
        </div>
        <div class="labels-inputs">
            <label for="bookmark-url" class="bookmark-url">URL</label>
            </br>
            <input type="url" id="bookmark-url" name="url" placeholder="Enter website URL (include https://)" class="form-input" required>
        </div>
        <div class="labels-inputs">
            <label for="bookmark-description" class="bookmark-description">Description</label>
            </br>
            <textarea rows="4" cols="40" id="bookmark-description" name="description" placeholder="Enter bookmark description" class="form-input-desc" required></textarea>
        </div>
        <div class="labels-inputs">
            <label for="bookmark-rating" class="bookmark-rating">Please rate this bookmark between 1-5 stars:</label>
            </br>
            <input type="number" id="bookmark-rating" name="rating" value=3 min=1 max=5 class="form-input-rating" required>
        </div>
        <div class="form-buttons">
            <button type="submit" name="create-bookmark" class="create-bookmark-button form-button">Add Bookmark</button>
            <button type="button" name="cancel-bookmark" class="cancel-bookmark-button form-button">Cancel</button>
        </div>
        
      </form>`;
    }

    function addTheBookmark() {
        return `
        <div class="add">
          <button type="button" class="add-button">Add Bookmark</button>
        </div>`
    }


    function handleAddBookmarkForm() {
        $('.add-form').on('submit', '#add-bookmark', function (event) {
            event.preventDefault();
            const title = $('#bookmark-title').val();
            const url = $('#bookmark-url').val();
            const desc = $('#bookmark-description').val();
            const rating = $('#bookmark-rating').val();
            api.createBookmark(title, url, desc, rating)
                .then(newBookmark => {
                    store.addItem(newBookmark);
                    store.isAddingBookmark = false;
                    store.error.message = null;
                    render();
                })
                .catch(err => {
                    store.addErrorToStore(err.message);
                    render();
                });
        })
    }

    function handleCancelAddBookmark() {
        $('.add-form').on('click', '.cancel-bookmark-button', function (event) {
            store.isAddingBookmark = false;
            store.error.message = null;
            render();
        });
    }


    function generateBookmarkElement(bookmark) {
        if (bookmark.expanded) {
            return `
      <li data-item-id="${bookmark.id}" class="bookmark-item expanded">
        <h2 class="bookmark-name">${bookmark.title}</h2>
        <p class="description">${bookmark.desc}</p>
        <h3 class="rating">Rating: ${bookmark.rating} Stars </h3>
        <div class="visit-site">
          <a href="${bookmark.url}">Visit Site</a>
        </div>
        <div class="bookmark-controls">
          <button class="condense-button" type="button">Condense</button>
          <button class="delete-button" type="button">Delete</button>
        </div>
      </li>`;
        } else {
            return `
      <li data-item-id="${bookmark.id}" class="bookmark-item">
        <h2 class="bookmark-name">${bookmark.title}</h2>
        <h3 class="rating">Rating: ${bookmark.rating} Stars</h3>
        <div class="bookmark-controls">
          <button class="expand-button" type="button">Detailed View</button>
          <button class="delete-button" type="button">Delete</button>
        </div>
      </li>`;
        }
    }


    function generateBookmarkString(bookmarkList) {
        const string = bookmarkList.map(bookmark => generateBookmarkElement(bookmark));
        return string.join('');
    }

    function render() {
        if (store.isAddingBookmark) {
            $('.add-form').html(generateAddBookmarkForm());
        } else {
            $('.add-form').html(addTheBookmark());
        }

        if (store.error.message) {
            $('.error-message').append(store.error.message);
        } else {
            $('.error-message').empty();
        }

        let bookmarks = [...store.bookmarks];
        let ratingFilteredBookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.minRating);
        let htmlString = generateBookmarkString(ratingFilteredBookmarks);
        $('.my-bookmarks').html(htmlString);
        
    }


    function getBookmarkIdFromElement(bookmark) {
        return $(bookmark).closest('li').data('item-id');
    }


    function handleRemoveBookmark(id) {
        $('.my-bookmarks').on('click', '.delete-button', function (event) {
            const id = getBookmarkIdFromElement(event.currentTarget);
            api.removeBookmark(id)
                .then(() => {
                    store.findAndDelete(id);
                    render();
                });
        });
    }



    function handleExpandButton() {
        $('.my-bookmarks').on('click', '.expand-button', function (event) {
            const id = getBookmarkIdFromElement(event.currentTarget);
            const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
            bookmark.expanded = true;
            render();
        });
    }


    function handleCondenseButton() {
        $('.my-bookmarks').on('click', '.condense-button', function (event) {
            const id = getBookmarkIdFromElement(event.currentTarget);
            const bookmark = store.bookmarks.find(bookmark => bookmark.id === id);
            bookmark.expanded = false;
            render();
        });
    }


    function handleFilterButton() {
        $('.filter').on('change', '#minimum-rating-select', function (event) {
            const ratingValue = $(event.currentTarget).val();
            store.minRating = ratingValue;
            render();
        });
    }


    function bindEventListeners() {
        handleAddBookmark();
        handleAddBookmarkForm();
        handleCancelAddBookmark();
        handleRemoveBookmark();
        handleExpandButton();
        handleCondenseButton();
        handleFilterButton();
    }

    return {
        render,
        bindEventListeners
    };

}());