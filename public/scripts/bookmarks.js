//
// Variables
//





//
// Methods
//

/**
 * Update an existing local storage item
 * @param  {String} id The name of the local storage item
 * @param  {Object} data The data to update
 * @param  {String} updateType The type of update to perform
 * @param  {Number} max The maximum number of data items per id
 */
let updateStorage = function ({id, data, updateType = 'add', max = null}){

    // Get item from local storage and parse
    let storedItem = localStorage.getItem(id);
    storedItem = JSON.parse(storedItem);

    // Check if the data already exists
    let itemIndex = storedItem.findIndex(item => item.url === data.url);
    if (itemIndex !== -1){

        // If update type is toggle
        if (updateType === 'toggle'){

            // Remove data from item
            storedItem.splice(itemIndex, 1);

        }
        
    } else {
    
        // Otherwise, add data to item
        storedItem.push(data);
    
    }

    // Check if item is not empty
    if (storedItem.length > 0){

        if (max) {
            console.log('before sort', storedItem);
            storedItem.sort((a, b) => {
                a.date - b.date
            });
            console.log('after sort', storedItem);
        }

        // If so, stringify and store in local storage
        storedItem = JSON.stringify(storedItem);
        localStorage.setItem('bookmarks', storedItem);

    } else {

        // Otherwise, remove item from local storage
        localStorage.removeItem('bookmarks');
    
    }
}

/**
 * Set a local storage item
 * @param  {String} id The name of the local storage item
 * @param  {Object} data The data to set
 */
let setStorage = function ({id, data}){

    // Create an empty array, and push the data to it
    let storedItem = [];
    storedItem.push(data);

    // Stringify and store in local storage
    storedItem = JSON.stringify(storedItem);
    localStorage.setItem(id, storedItem);
}

/**
 * Get bookmarks and update page
 */
let initBookmarks = function() {

    // Get the bookmarks from local storage
    let storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    // Sort the bookmarks by most recent
    if (storedBookmarks) {
        storedBookmarks.sort((a, b) => {
            let aDate = Date.parse(a.dateBookmarked);
            let bDate = Date.parse(b.dateBookmarked);
            return bDate - aDate;
        });
    }

    // Get all the bookmark buttons on the page
    let bookmarkToggles = document.querySelectorAll('.bookmark-toggle');

    let toggleBookmarkButtons = function(bookmarks, buttons){

        // If there are no buttons, bail
        if (!buttons) return;

        if (bookmarks) {

            for (const button of buttons){
                let match = false;
                for (const bookmark of bookmarks) {
                    if (button.dataset.url == bookmark.url){
                        match = true;
                    }
                }
    
                let parent = button.closest('li');
    
                if (match){
    
                    // Toggle active class
                    button.classList.add('is-active');
    
                    if (parent){
                        // Toggle bookmark attribute
                        parent.setAttribute('data-bookmark', '');
                    
                    }
    
                } else {
    
                    // Toggle active class
                    button.classList.remove('is-active');
    
                    if (parent){
                        // Toggle bookmark attribute
                        parent.removeAttribute('data-bookmark');
                    
                    }
    
                }
            }

        } else {

            for (const button of buttons){

                let parent = button.closest('li');

                // Remove active class
                button.classList.remove('is-active');

                if (parent){
                    // Remove bookmark attribute
                    parent.removeAttribute('data-bookmark');
                
                }

            }
        }

    }
    
    // Get the main container
    let main = document.querySelector('main');

    if (main.classList.contains('post')){

        // Get the article nav element
        let articlesNav = document.querySelector('nav.articles');

        // If the article nav is present, init its bookmarks
        if (articlesNav){

            // Get the bookmarks section elements
            let bookmarksSection = articlesNav.querySelector('.bookmarks');
            let bookmarksSectionToggle = bookmarksSection.querySelector('.accordion-toggle');
            let bookmarksSectionPanel = bookmarksSection.querySelector('.bookmarks-panel');

            // Check if there are any store bookmarks
            if (storedBookmarks){
                
                // Show bookmark section
                bookmarksSection.removeAttribute('hidden');

                // Expand accordion panel to show bookmarks
                bookmarksSectionToggle.setAttribute('aria-expanded', 'true');
                bookmarksSectionPanel.removeAttribute('hidden');
            
                // Generate bookmarks links for the bookmarks section
                let markup = storedBookmarks.map((bookmark) => 
                `<li class="${bookmark.url === window.location.pathname ? 'is-active' : ''}">
                    <a href="${bookmark.url}">${bookmark.title}</a>
                    <button class="bookmark-toggle is-active" data-title="${bookmark.title}" data-url="${bookmark.url}" data-project="${bookmark.project}">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path vector-effect="non-scaling-stroke" d="m4.84 22.61 6.82-6.3c.19-.18.49-.18.68 0l6.82 6.3c.32.3.84.07.84-.37V1.5c0-.28-.22-.5-.5-.5h-15c-.28 0-.5.22-.5.5v20.75c0 .44.52.66.84.37Z"/> 
                    </svg>
                    </button>
                </li>`
                ).join('');

                // Update the DOM with the generated links
                bookmarksSectionPanel.innerHTML = markup;            

            } else {
                
                // Hide bookmark section
                bookmarksSection.setAttribute('hidden', '');
                
                // Collapse accordion panel
                bookmarksSectionToggle.setAttribute('aria-expanded', 'false');
                bookmarksSectionPanel.setAttribute('hidden', '');
                
            }

        }

    }  

    // Toggle active state bookmark toggles
    toggleBookmarkButtons(storedBookmarks, bookmarkToggles);
  
}


/**
 * Update bookmarks on click events
 * @param  {Event} event The event object
 */
let updateBookmarks = function(event) {

    // Only run on bookmark toggles
    if (!event.target.matches('.bookmark-toggle')) return;
    
    // Store the target link title, url and project
    let post = {
        title: event.target.dataset.title,
        url: event.target.dataset.url,
        project: event.target.dataset.project,
        dateBookmarked: new Date()
    }

    // Check if local storage has item
    if (localStorage.getItem('bookmarks')){

        // If so, update with new data
        updateStorage({
            id: 'bookmarks',
            data: post,
            updateType: 'toggle'
        });

    } else {
      
        // Otherwise, create a new item
        setStorage({
            id: 'bookmarks',
            data: post
        });
    
    }

    // Update the bookmarks in the DOM
    initBookmarks();

}

/**
 * Update recently accessed articles on page load
 * @param  {Event} event The event object
 */
let updateRecentArticles = function(event) {

    let bookmarkBtn = document.querySelector('main.post article section.header .bookmark-toggle');

    if (!bookmarkBtn) return;

    let post = {
        title: bookmarkBtn.dataset.title,
        url: bookmarkBtn.dataset.url,
        project: bookmarkBtn.dataset.project,
        dateVisited: new Date()
    }

    // Check if local storage has item
    if (localStorage.getItem('recent')){

        // If so, update with new data
        updateStorage({
            id: 'recent',
            data: post,
            max: 6
        });

    } else {
        
        // Otherwise, create a new item
        setStorage({
            id: 'recent',
            data: post
        });
    
    }

}
  
//
// Inits & Event Listeners
//

initBookmarks();
document.addEventListener('click', updateBookmarks);
updateRecentArticles();

  
//
// Exports
//