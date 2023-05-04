//
// Methods
//

/**
 * Add ARIA attributes and hide content on page load
 */
let initTabs = function(){

    // Get the [data-tabs] element
    let tabList = document.querySelector('[data-tabs]');
    if (!tabList) return;

    // Get the list items and links
    let listItems = tabList.querySelectorAll('li');
    let links = tabList.querySelectorAll('a');

    // Add ARIA to list
    tabList.setAttribute('role', 'tablist');

    // Add ARIA to the list items
    for (let item of listItems) {
        item.setAttribute('role', 'presentation');
    }

    // Add ARIA to the links and content
    links.forEach((link, index) => {
        
        // Get the the target element
        let tabPane = document.querySelector(link.hash);
        if (!tabPane) return;

        // Add [role] and [aria-selected] attributes
        link.setAttribute('role', 'tab');
        link.setAttribute('aria-selected', index === 0 ? true : false);

        // If it's not the active (first) tab, remove focus
        if (index > 0) {
            link.setAttribute('tabindex', -1);
        }

        // If there's no ID, add one
        if (!link.id) {
            link.id = `tab_${tabPane.id}`;
        }

        // Add ARIA to tab pane
        tabPane.setAttribute('role', 'tabpanel');
        tabPane.setAttribute('aria-labelledby', link.id);

        // If not the active pane, hide it
        if (index > 0) {
            tabPane.setAttribute('hidden', '');
        }
    
    });

}

/**
 * Toggle tab visibility
 * @param  {Node} targetTab The tab to show
 */
let toggleTab = function(targetTab) {

    // Get the target tab pane
    let targetPane = document.querySelector(targetTab.hash);
    if (!targetPane) return;

    // Get the current tab and content
    let currentTab = targetTab.closest('[role="tablist"]').querySelector('[aria-selected="true"]');
    let currentPane = document.querySelector(currentTab.hash);

    // Update the selected tab
    targetTab.setAttribute('aria-selected', true);
    currentTab.setAttribute('aria-selected', false);

    // Update the visible targetPane
    targetPane.removeAttribute('hidden');
    currentPane.setAttribute('hidden', '');

    // Make sure current tab can be focused and other tabs cannot
    targetTab.removeAttribute('tabindex');
    currentTab.setAttribute('tabindex', -1);

}

/**
 * Show content on click events
 * @param  {Event} event The event object
 */
let tabClickHandler = function(event) {

    // Only run on tab links
    if (!event.target.matches('[role="tab"]')) return;

    // Prevent the link from updating the URL
    event.preventDefault();

    // Ignore the currently active tab
    if (event.target.matches('[aria-selected="true"]')) return;

    // Toggle tab visibility
    toggleTab(event.target);

}

/**
 * Update tab content on keyboard events
 * @param  {Event} event The event object
 */
let tabKeyHandler = function(event) {

    // Only run for left and right arrow keys
    if (!['ArrowLeft', 'ArrowRight'].includes(event.code)) return;

    // Only run if element in focus is on a tab
    let tab = document.activeElement.closest('[role="tab"]');
    if (!tab) return;

    // Get the currently active tab
    let currentTab = tab.closest('[role="tablist"]').querySelector('[role="tab"][aria-selected="true"]');

    // Get the parent list item
    let listItem = currentTab.closest('li');

    // If right arrow, get the next sibling
    // Otherwise, get the previous
    let nextListItem = event.code === 'ArrowRight' ? listItem.nextElementSibling : listItem.previousElementSibling;
    if (!nextListItem) return;
    let nextTab = nextListItem.querySelector('a');

    // Toggle tab visibility
    toggleTab(nextTab);
    nextTab.focus();

}


//
// Inits & Event Listeners
//

initTabs();
document.addEventListener('click', tabClickHandler);
document.addEventListener('keydown', tabKeyHandler);

// Check url for starting tab
if (window.location.hash){
    let urlTargetTab = document.querySelector(`a[href="${window.location.hash}"]`);
    toggleTab(urlTargetTab);
}


