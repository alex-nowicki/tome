//
// Methods
//

/**
 * Get URL parameters
 * @param  {String} url The url to get query string parameters
 */
let getParams = function(url = window.location) {

	// Create a params object
	let params = {};

	new URL(url).searchParams.forEach(function (val, key) {
		if (params[key] !== undefined) {
			if (!Array.isArray(params[key])) {
				params[key] = [params[key]];
			}
			params[key].push(val);
		} else {
			params[key] = val;
		}
	});

	return params;

}

let updateInputStates = function(targetFilter) {

    // Update checked state on input
    if (targetFilter.type === 'radio'){

        if (targetFilter.hasAttribute('checked')) {
            targetFilter.removeAttribute('checked');
        } else {
            for (const filter of targetFilter.closest('form').querySelectorAll('input[type="radio"]')) {
                filter.removeAttribute('checked');
            }
            targetFilter.setAttribute('checked', '');
        }

    } else if (targetFilter.type === 'checkbox'){

        if (targetFilter.hasAttribute('checked')) {
            targetFilter.removeAttribute('checked');
        } else {
            targetFilter.setAttribute('checked', '');
        }

        let checkboxes = targetFilter.closest('form').querySelectorAll('input[type="checkbox"]');
        let checkedCheckboxes = targetFilter.closest('form').querySelectorAll('input[type="checkbox"]:checked');

        if (checkedCheckboxes.length === 1) {
            for (const box of checkedCheckboxes) {
                box.setAttribute('disabled', '');
            }
        } else {
            for (const box of checkboxes) {
                box.removeAttribute('disabled');
            }
        }

    }

}

/**
 * Filter list
 * @param  {Object} targetFilter The filter object containing the following data
 * @param  {Node} targetFilter.input The input target
 * @param  {Array} targetFilter.values The form values
 * @param  {String} targetFilter.type The filter type
 * @param  {Node} targetFilter.list The filter list container
 * @param  {Nodelist} targetFilter.items The filter list items
 * @param  {Node} targetFilter.sort The paired sort group, if available
 */
let filterList = function(targetFilter) {

    console.log(targetFilter);

    updateInputStates(targetFilter.input);

    let positiveResults = false;

    for (const item of targetFilter.items) {

        // If the item has a button, and the button is pressed, bail
        if (item.querySelector(':checked')) break;

        if (targetFilter.type === 'category'){

            // Store the item category
            let category = item.dataset.category.toLowerCase();

            // Check item category and show or hide accordingly
            if (targetFilter.values.includes(category)){
                item.removeAttribute('hidden');
                positiveResults = true;
            } else {
                item.setAttribute('hidden', '');
            }

        } else if (targetFilter.type === 'title'){

            // Store the item title
            let title = item.dataset.title.toLowerCase();

            // Check item title and show or hide accordingly
            if (targetFilter.values.includes(title)){
                item.removeAttribute('hidden');
                positiveResults = true;
            } else {
                item.setAttribute('hidden', '');
            }

        } else if (targetFilter.type === 'bookmark'){

            // Check bookmark state and show or hide accordingly
            if (item.hasAttribute('data-bookmark')){
                item.removeAttribute('hidden');
                positiveResults = true;
            } else {
                item.setAttribute('hidden', '');
            }

        } else if (targetFilter.type === 'all'){

            // Show all items
            item.removeAttribute('hidden');
            positiveResults = true;

        }
        
    }

    let targetSort = {};
    targetSort.list = targetFilter.list;
    targetSort.items = targetFilter.items;

    if (targetFilter.sort) targetSort.type = targetFilter.sort;

    if (targetSort.type !== undefined && positiveResults) {
        sortList(targetSort);
    }

    let errorMessage = targetFilter.list.querySelector('.error');
   
    if (errorMessage){
        
        // If there are no positive results,
        if (!positiveResults && errorMessage !== undefined) {

            // Reveal the error message
            targetFilter.list.querySelector('.error').removeAttribute('hidden');

        } else {
            // Reveal the error message
            targetFilter.list.querySelector('.error').setAttribute('hidden', '');
        }
    }

}


/**
 * Sort list
 * @param  {Object} targetSort The sort object containing the following data
 * @param  {String} targetSort.type The sort type
 * @param  {Node} targetSort.list The sort list container
 * @param  {Nodelist} targetSort.items The sort list items
 */
let sortList = function(targetSort) {

    console.log(targetSort);

    // Remove cloned items
    for (let item of targetSort.items){
        if (item.hasAttribute('data-clone')) item.remove();
    }

    // Filter list to only include active (shown) items
    targetSort.items = Array.from(targetSort.items).filter((item) => {
        return !item.hasAttribute('hidden');
    })

    if (targetSort.type === 'byCollection'){

        sortByCollection(targetSort);

    } else {

        // Hide collection accordions
        let collectionAccordions = targetSort.list.querySelectorAll('.accordion-group');
        for (let accordion of collectionAccordions){
            accordion.setAttribute('hidden', '');
        }

        targetSort.items.sort((a,b) => {
            if (targetSort.type === 'byTitle'){
                a = a.dataset.title;
                b = b.dataset.title;
                if (a < b) return -1;
                if (a > b) return 0;
                return 0;
            } else if (targetSort.type === 'byDate'){
                console.log('sorting by date')
                a = Date.parse(a.dataset.date);
                b = Date.parse(b.dataset.date);
                return b - a;
            } else if (targetSort.type === 'byDateNumAsc'){
                a = a.dataset.date;
                b = b.dataset.date;
                return a - b;
            } else if (targetSort.type === 'byDateNumDesc'){
                a = a.dataset.date;
                b = b.dataset.date;
                return b - a;
            } else if (targetSort.type === 'byCollection'){
                // Already sorted
            } else if (targetSort.type === 'byPriority'){
                a = a.dataset.priority;
                b = b.dataset.priority;
                return b - a;
            }
        
        })
        
        // If sorting by priority, add each item to the bottom of the list
        if (targetSort.type === 'byPriority'){

            targetSort.items.forEach((elem) => {
                targetSort.list.lastElementChild.after(elem);
            });

        // Otherwise, reverse the results and add each sorted item to the top of the list
        } else {

            targetSort.items.reverse().forEach((elem) => {
                targetSort.list.firstElementChild.before(elem);
            })
        }

    }

}

/**
 * Sort list items by collection
 * @param  {Object} targetSort The sort object containing the following data
 * @param  {Node} targetSort.list The sort list container
 * @param  {Nodelist} targetSort.items The sort list items
 */
let sortByCollection = function(targetSort) {

    // Get the collection accordions
    let collectionAccordions = targetSort.list.querySelectorAll('.accordion-group[data-collection]');

    for (let accordion of collectionAccordions) {

        // Get the collection name
        let collection = accordion.dataset.collection;

        // Get the accordion panel
        let accordionPanel = accordion.querySelector('.accordion-panel');
        
        for (let item of targetSort.items) {
            
            // If the item has no collections assigned and the current accordion in 'uncollected', add the item
            if (item.dataset.collections === undefined
                && collection === 'Uncollected'){
                accordionPanel.append(item);
            
            // Otherwise, if the item has collections assigned and they include the current accordion collection, add the item
            } else if (item.dataset.collections !== undefined 
                && JSON.parse(item.dataset.collections).includes(collection)){
                
                // If the item is already in a collection accordion, clone it
                if (item.parentNode.matches('.accordion-panel')){
                let clone = item.cloneNode(true);
                clone.setAttribute('data-clone', '');
                item.parentNode.appendChild(clone);
                accordionPanel.append(clone);

                // Otherwise, move it
                } else {
                    accordionPanel.append(item);
                }
            }
        };

        // If the accordion contains at least one item, show it
        if (accordionPanel.querySelectorAll('li.article:not([hidden])').length > 0) {
            accordion.removeAttribute('hidden')
        
        // Otherwise, hide it
        } else {
            accordion.setAttribute('hidden', '');
        }

    };

}

/**
 * Search list
 * @param  {Object} targetSearch The filter object containing the following data
 */
let searchList = function(targetSearch) {

    let stopWords = ['a', 'an', 'and', 'are', 'aren\'t', 'as', 'by', 'can', 'cannot', 'can\'t', 'could', 'couldn\'t', 'how', 'is', 'isn\'t', 'it', 'its', 'it\'s', 'that', 'the', 'their', 'there', 'they', 'they\'re', 'them', 'to', 'too', 'us', 'very', 'was', 'we', 'well', 'were', 'what', 'whatever', 'when', 'whenever', 'where', 'with', 'would', 'yet', 'you', 'your', 'yours', 'yourself', 'yourselves', 'the'];

    // Create a regex for each query
    let regMap = targetSearch.value.toLowerCase().split(' ').filter((word) => {
        return word.length && !stopWords.includes(word);
    }).map((word) => {
        return new RegExp(word, 'i');
    });
    
    // Get and sort the results
    let results = Array.from(targetSearch.items).reduce((results, item) => {

        // Reset priority
        item.removeAttribute('data-priority');

        // Setup priority count
        let priority = 0;

        // Assign priority
        for (let reg of regMap) {

            // Check whether post title includes search query
            if (reg.test(item.dataset.title)) { 
                
                // If so, add to priority
                priority += 100;

                let titleWords = item.dataset.title.split(' ');

                // Check whether post title starts with search query
                titleWords.forEach((word) => {
                    if (word.toLowerCase().startsWith(targetSearch.value.toLowerCase())) {

                        // If so, add to priority
                        priority += 1000;
    
                    }
                });                

            }

            // Check whether post content includes search query
            // let occurences = item.dataset.content.match(reg);
            // if (occurences) { priority += occurences.length; }
        }

        // If any matches, push to results
        if (priority > 0) {
            item.setAttribute('data-priority', priority);
            results.push(item);
        }

        return results;

    }, []);

    console.log(results);

    // Display the results
    filterList({
        input: targetSearch.input,
        values: results.map((item) => {
            return item.dataset.title.toLowerCase();
        }),
        type: targetSearch.type,
        list: targetSearch.list,
        items: targetSearch.items,
        sort: 'byPriority'
    });

}



//
// Inits & Event Listeners
//

let filterGroups = document.querySelectorAll('.filter-group');
let sortGroups = document.querySelectorAll('.sort-group');
let searchGroups = document.querySelectorAll('.search-group');

for (const group of filterGroups){
    group.addEventListener('input', (event) => {
        event.preventDefault;
        filterList({
            input: event.target,
            values: Array.from(group.querySelectorAll('input:checked, select')).map((input) => input.value),
            type: event.target.dataset.type,
            list: document.querySelector(group.dataset.list),
            items: document.querySelectorAll(`${group.dataset.list} ${group.dataset.items}`),
            sort: document.querySelector(group.dataset.sort).value
        });
    });
}

for (const group of sortGroups){
    group.addEventListener('input', (event) => {
        sortList({
            input: event.target,
            type: event.target.value, 
            list: document.querySelector(group.dataset.list),
            items: document.querySelectorAll(`${group.dataset.list} ${group.dataset.items}`)
        })
    });
}

for (const group of searchGroups){

    let input = group.querySelector('input');
    let list = group.querySelector(group.dataset.list);
    let items = group.querySelectorAll(`${group.dataset.list} ${group.dataset.items}`);

    group.addEventListener('input', function(event){
        if (input.value.length > 2){
            searchList({
                input: input,
                value: input.value,
                type: input.dataset.type,
                list: list,
                items: items
            });
            list.removeAttribute('hidden');
        } else if (!list.querySelector(":checked")) {
            list.setAttribute('hidden', '');
        }
    })

    group.addEventListener('submit', (event) => {
        // Prevents default submit server call and triggers search function
        event.preventDefault();
        searchList({
            input: input,
            value: value,
            type: input.dataset.type,
            list: list,
            items: items
        });
        list.removeAttribute('hidden');
    })

    group.addEventListener('keydown', function(event){
        
        let activeElement = document.activeElement;
        console.log('activeElement old', activeElement);

        if (event.key === "ArrowDown"){
            event.preventDefault();

            if (activeElement.matches('input')){
                console.log('Down arrowing from input');
                let targetElem = list.querySelector('a');
                console.log(targetElem);
                targetElem.focus();

            } else if (activeElement.matches('a')) {
                console.log('Down arrowing from a');
                let targetElem = activeElement.closest('li').nextElementSibling;
                if (targetElem) {
                    targetElem.querySelector('a').focus();
                }
            }
            
        } else if (event.key === "ArrowUp"){

            if (activeElement.matches('a')) {
                console.log('Up arrowing from a');
                let targetElem = activeElement.closest('li').previousElementSibling;
                if (targetElem) {
                    targetElem.querySelector('a').focus();
                } else {
                    input.focus();
                }
            }

        }

    })

}


// Check url for query string parameters
let params = getParams();

// If url contains parameters,
if (params.filter){

    // Check to see if the page contains a filter group
    for (const group of filterGroups){
        let inputs = group.querySelectorAll('input');
        let targetInput = group.querySelector(`input[value="${params.filter}"]`)

        // If it does, apply the filter
        if (targetInput) {

            // Remove the checked attribute to account for pre-checked filters
            for (const input of inputs){
                input.removeAttribute('checked');
            }

            filterList({
                input: targetInput,
                values: [params.filter],
                type: targetInput.dataset.type,
                list: document.querySelector(group.dataset.list),
                items: document.querySelectorAll(`${group.dataset.list} ${group.dataset.items}`)
            });
        }
    }
}


