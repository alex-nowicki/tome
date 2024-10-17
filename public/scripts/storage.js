//
// Variables
//





//
// Methods
//

let dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short' 
});

/**
 * Update an existing local storage item
 * @param  {String} id The name of the local storage item
 * @param  {Object} data The data to update
 * @param  {String} updateType The type of update to perform
 * @param  {Number} max The maximum number of data items per id
 */
let updateStorage = function ({id, data, updateType = 'add', max = null}){

    console.log('Updating storage', id, updateType, max);

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

        // Sort the array from most recent to oldest
        storedItem.sort((a, b) => {
            a = Date.parse(a.date);
            b = Date.parse(b.date);
            return b - a;
        });

        // If a maximum number of items is defined,
        while (max && storedItem.length > max) {

            // Remove the last item from array
            storedItem.splice((storedItem.length - 1), 1);

        }

        // If so, stringify and store in local storage
        storedItem = JSON.stringify(storedItem);
        localStorage.setItem(id, storedItem);

    } else {

        // Otherwise, remove item from local storage
        localStorage.removeItem(id);
    
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
            let bookmarksSectionDivider = bookmarksSection.nextElementSibling;

            // Check if there are any stored bookmarks
            if (storedBookmarks){
            
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
                
                // Show bookmark section and divider
                bookmarksSection.removeAttribute('hidden');
                bookmarksSectionDivider.removeAttribute('hidden');

                // Expand accordion panel to show bookmarks
                bookmarksSectionToggle.setAttribute('aria-expanded', 'true');
                bookmarksSectionPanel.removeAttribute('hidden');

            } else {
                
                // Hide bookmark section and divider
                bookmarksSection.setAttribute('hidden', '');
                bookmarksSectionDivider.setAttribute('hidden', '');
                
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
 * Get recent articles and update page
 */
let initRecentArticles = function() {

    // Get the recent articles from local storage
    let storedRecentArticles = JSON.parse(localStorage.getItem('recent'));

    console.log(storedRecentArticles[0].icon);
    console.log(storedRecentArticles[0].category);

    // Get the main container
    let main = document.querySelector('main');

    if (main.classList.contains('home')){

        let recentArticlesSection = main.querySelector('.recent');
        let recentArticlesSectionCardGroup = recentArticlesSection.querySelector('.card-group');

        // Check if there are any stored recent articles
        if (storedRecentArticles){

            let markup = storedRecentArticles.map((article) =>
                `<li class="card compact">
                    <div class="info-group">
                        <h3>${article.title}</h3>
                        <p class="category">${JSON.parse(article.icon)}<span>${article.category}</span></p>
                        <p class="description">${article.description ? article.description : ''}</p>
                        <div class="meta">
                            <p class="date">Accessed ${dateFormatter.format(Date.parse(article.date))}</p>
                        </div>
                    </div>
                    <a href="${article.url}" aria-label="Open Article"><span>Open Article</span> 
                        <svg class="icon arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path vector-effect="non-scaling-stroke" d="m6.5 1 11 11-11 11"></path>
                        </svg>
                    </a>    
                </li>`
            ).join(' ');

            console.log(markup);

            // Update the DOM with the generated links
            recentArticlesSectionCardGroup.innerHTML = markup;

            // Show recent articles section
            recentArticlesSection.removeAttribute('hidden');

        } else {

            // Hide recent articles section
            recentArticlesSection.setAttribute('hidden', '');

        }

    } else if (main.classList.contains('post')){

        // Get the article nav element
        let articlesNav = document.querySelector('nav.articles');

        // If the article nav is present, repopulate the list based on recently visited articles
        if (articlesNav){

            // Get the recent articles section elements
            let recentArticlesSection = articlesNav.querySelector('.recent');
            let recentArticlesSectionToggle = recentArticlesSection.querySelector('.accordion-toggle');
            let recentArticlesSectionPanel = recentArticlesSection.querySelector('.recent-panel');
            let recentArticlesSectionDivider = recentArticlesSection.nextElementSibling;
            
            // Check if there are any stored recent articles
            if (storedRecentArticles){
                           
                // Generate recent article links for the recent articles section
                let markup = storedRecentArticles.map((article) => 
                    `<li class="${article.url === window.location.pathname ? 'is-active' : ''}">
                        <a href="${article.url}">${article.title}</a>
                        <button class="bookmark-toggle" data-title="${article.title}" data-url="${article.url}" data-project="${article.project}">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path vector-effect="non-scaling-stroke" d="m4.84 22.61 6.82-6.3c.19-.18.49-.18.68 0l6.82 6.3c.32.3.84.07.84-.37V1.5c0-.28-.22-.5-.5-.5h-15c-.28 0-.5.22-.5.5v20.75c0 .44.52.66.84.37Z"/> 
                            </svg>
                        </button>
                    </li>`
                ).join('');

                // Update the DOM with the generated links
                recentArticlesSectionPanel.innerHTML = markup;
                
                // Show recent articles section and divider
                recentArticlesSection.removeAttribute('hidden');
                recentArticlesSectionDivider.removeAttribute('hidden');

                // Expand accordion panel to show recent articles
                recentArticlesSectionToggle.setAttribute('aria-expanded', 'true');
                recentArticlesSectionPanel.removeAttribute('hidden');

            } else {
                
                // Hide bookmark section and divider
                recentArticlesSection.setAttribute('hidden', '');
                recentArticlesSectionDivider.setAttribute('hidden', '');
                
                // Collapse accordion panel
                recentArticlesSectionToggle.setAttribute('aria-expanded', 'false');
                recentArticlesSectionPanel.setAttribute('hidden', '');
                
            } 

        }

    }

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
        category: bookmarkBtn.dataset.category,
        icon: bookmarkBtn.dataset.categoryIcon,
        description: bookmarkBtn.dataset.description,
        date: new Date()
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

initRecentArticles();
updateRecentArticles();
initBookmarks();
document.addEventListener('click', updateBookmarks);


//
// Exports
//