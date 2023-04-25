//
// Variables
//





//
// Methods
//

/**
 * Get bookmarks and update page
 */
let initBookmarks = function() {

    // Get the bookmarks from local storage
    let storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    
    // Get the sidepanel element
    let sidepanel = document.querySelector('.sidepanel');

    // If sidepanel is present, init its bookmarks
    if (sidepanel){

        // Get the bookmarks section elements
        let bookmarksSection = sidepanel.querySelector('.bookmarks');
        let bookmarksToggle = bookmarksSection.querySelector('.accordion-toggle');
        let bookmarksPanel = bookmarksSection.querySelector('.bookmarks-panel');

        // Get the tree links
        let treeLinks = sidepanel.querySelectorAll('.tree .accordion-panel li');

        // Check if there are any store bookmarks
        if (storedBookmarks){
            
            // Show accordion toggle button
            bookmarksToggle.removeAttribute('hidden');

            // Expand accordion panel to show bookmarks
            bookmarksToggle.setAttribute('aria-expanded', 'true');
            bookmarksPanel.removeAttribute('hidden');
        
            // Generate bookmarks links for the bookmarks section
            let markup = storedBookmarks.map((bookmark) => 
            `<li class="${bookmark.url === window.location.pathname ? 'is-active' : ''}">
                <a href="${bookmark.url}">${bookmark.title}</a>
                <button class="bookmark-toggle is-active">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path vector-effect="non-scaling-stroke" d="m4.84 22.61 6.82-6.3c.19-.18.49-.18.68 0l6.82 6.3c.32.3.84.07.84-.37V1.5c0-.28-.22-.5-.5-.5h-15c-.28 0-.5.22-.5.5v20.75c0 .44.52.66.84.37Z"/> 
                </svg>
                </button>
            </li>`
            ).join('');

            // Update the DOM with the generated links
            bookmarksPanel.innerHTML = markup;
            
            // Toggle active state of bookmark toggles in the tree section
            for (const link of treeLinks){
                let match = false;
                for (const bookmark of storedBookmarks) {
                    if (link.querySelector('a').pathname == bookmark.url){
                        match = true;
                    }
                }
                if (match){
                    link.querySelector('button').classList.add('is-active');
                } else {
                    link.querySelector('button').classList.remove('is-active');
                }
            }

        } else {
            
            // Hide toggle button
            bookmarksToggle.setAttribute('hidden', '');
            
            // Collapse accordion panel
            bookmarksToggle.setAttribute('aria-expanded', 'false');
            bookmarksPanel.setAttribute('hidden', '');
            
            // Remove active state from all bookmark toggles
            for (const link of treeLinks){
                link.querySelector('button').classList.remove('is-active');
            }
        }

    }

    // Get the project page
    let projectPage = document.querySelector('main.project');

    // If the project page tabs are present, init its bookmarks
    if (projectPage && storedBookmarks){

        // Get the links inside the tab panels
        let tabLinks = projectPage.querySelectorAll('section > ul > li');

        // Toggle active state of bookmark toggles in the tab panels
        for (const link of tabLinks){
            let match = false;
            for (const bookmark of storedBookmarks) {
                if (link.querySelector('a').pathname == bookmark.url){
                    match = true;
                }
            }
            if (match){

                // Toggle active class
                link.querySelector('button').classList.add('is-active');

                // Assign order to make bookmarks float to the top of the list
                link.style.order = 1;

            } else {

                // Toggle active class
                link.querySelector('button').classList.remove('is-active');

                // Assign order to make non-bookmarks float to the bottom of the list
                link.style.order = 2;

            }
        }
    }    
  
}


/**
 * Update bookmarks on click events
 * @param  {Event} event The event object
 */
let bookmarksClickHandler = function(event) {

    // Only run on bookmark toggles
    if (!event.target.matches('.bookmark-toggle')) return;

    // Get the target link
    let targetLink = event.target.closest('li').querySelector('a');
    
    // Store the target link title, url and project
    let post = {
        title: targetLink.innerHTML,
        url: targetLink.pathname,
        project: targetLink.pathname.split('/')[1]
    }

    console.log(post);

    /**
     * Update an existing local storage item
     * @param  {String} id The name of the local storage item
     * @param  {Object} data The data to update
     */
    let updateStorage = function (id, data){

        // Get item from local storage and parse
        let storedItem = localStorage.getItem(id);
        storedItem = JSON.parse(storedItem);

        // Check if the data already exists
        let itemIndex = storedItem.findIndex(item => item.url === data.url);
        if (itemIndex !== -1){
            
            // If so, remove data from item
            storedItem.splice(itemIndex, 1);

        } else {
        
            // Otherwise, add data to item
            storedItem.push(data);
      
        }

        console.log('storedItem', storedItem)

        // Check if item is not empty
        if (storedItem.length > 0){

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
    let setStorage = function (id, data){

        // Create an empty array, and push the data to it
        let storedItem = [];
        storedItem.push(data);

        // Stringify and store in local storage
        storedItem = JSON.stringify(storedItem);
        localStorage.setItem(id, storedItem);
    }

    // Check if local storage has item
    if (localStorage.getItem('bookmarks')){

        // If so, update with new data
        updateStorage('bookmarks', post);

    } else {
      
        // Otherwise, create a new item
        setStorage('bookmarks', post);
    
    }

    // Update the bookmarks in the DOM
    initBookmarks();

}
  
  
//
// Inits & Event Listeners
//

initBookmarks();
document.addEventListener('click', bookmarksClickHandler);

  
//
// Exports
//