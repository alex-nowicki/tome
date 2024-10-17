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

/**
 * Update input selection state
 * @param  {Object} targetFilter The filter object containing the following data
 * @param  {Node} targetFilter.input The input target
 * @param  {Number} targetFilter.min Minimum number of selected inputs
 * @param  {Number} targetFilter.max Maximum number of selected inputs
 */
let updateInputStates = function(targetFilter) {

    // Get the argument values
	let {input, min, max} = targetFilter;

    // For input groups that allow a single selection,
    if (input.type === 'radio'){

        // If input is currently selected, deselect it
        if (input.hasAttribute('checked')) {
            input.removeAttribute('checked');

        // Otherwise, deselect all other options and select the target input
        } else {
            for (const filter of input.closest('form').querySelectorAll('input[type="radio"]')) {
                filter.removeAttribute('checked');
            }
            input.setAttribute('checked', '');
        }

    // For input groups that allow multiple selections
    } else if (input.type === 'checkbox'){

        // Retrieve and store input clones
        let clones = [...input.closest('form').querySelectorAll(`[value="${input.value}"]`)];

        // If there are one or more clones,
        if (clones.length > 1) {

            // Get the original input
            for (let clone of clones) {
                if (!clone.closest('[data-clone]')) {
                    input = clone;
                    break;
                }
            }
        } 

        // If input is currently selected, deselect it
        if (input.hasAttribute('checked')) {
            input.checked = false;
            input.removeAttribute('checked');

        // Otherwise, select it
        } else {
            input.checked = true;
            input.setAttribute('checked', '');
        }   

        // Store selected and deselected inputs
        let checkedBoxes = input.closest('form').querySelectorAll(':not([data-clone]) input[type="checkbox"]:checked');
        let uncheckedBoxes = input.closest('form').querySelectorAll(':not([data-clone]) input[type="checkbox"]:not(:checked)');

        // If selected inputs are equal to or smaller than the optionally defined minimum,
        if (min && checkedBoxes.length <= min) {

            // Disable selected inputs
            for (const box of checkedBoxes) {
                box.setAttribute('disabled', '');
            }

        // Otherwise, enable selected inputs
        } else {
            for (const box of checkedBoxes) {
                box.removeAttribute('disabled');
            }
        }

        // If selected inputs are equal to or greater than the optionally defined maximum,
        if (max && checkedBoxes.length >= max) {

            // Disable deselected inputs
            for (const box of uncheckedBoxes) {
                box.setAttribute('disabled', '');
            }

        // Otherwise, enable deselected inputs
        } else {
            for (const box of uncheckedBoxes) {
                box.removeAttribute('disabled');
            }
        }
    }
}

/**
 * Filter list
 * @param  {Object} targetFilter The filter object containing the following data
 * @param  {Array} targetFilter.values The form values
 * @param  {String} targetFilter.type The filter type
 * @param  {Node} targetFilter.list The filter list container
 * @param  {Nodelist} targetFilter.items The filter list items
 * @param  {Node} targetFilter.sort The paired sort group, if available
 */
let filterList = function(targetFilter) {

    let {values, type, list, items, sort} = targetFilter;

    let positiveResults = 0;

    for (const item of items) {

        if (type === 'category'){

            // Store the item category
            let category = item.dataset.category.toLowerCase();

            // If item category is included, show item
            if (values.includes(category)){
                item.removeAttribute('hidden');
                positiveResults += 1;

            // Otherwise, hide item
            } else {
                item.setAttribute('hidden', '');
            }

        } else if (type === 'title'){

            // Store the item title
            let title = item.dataset.title.toLowerCase();

            // If item title is included, show item
            if (values.includes(title)){
                item.removeAttribute('hidden');
                positiveResults += 1;

            // Otherwise, hide item unless it contains a checked input
            } else if (!item.querySelector(':checked')) {
                item.setAttribute('hidden', '');
            }

        } else if (type === 'bookmark'){

            // If item is bookmarked, show item
            if (item.hasAttribute('data-bookmark')){
                item.removeAttribute('hidden');
                positiveResults += 1;

            // Otherwise, hide item
            } else {
                item.setAttribute('hidden', '');
            }

        } else if (type === 'all'){

            // Show all items
            item.removeAttribute('hidden');
            positiveResults += 1;

        }
        
    }

    if (sort) {

        let targetSort = sort;
    
        if (targetSort.input) {
            targetSort.type = JSON.parse(targetSort.input.value);
        }

        if (targetSort.type !== undefined && positiveResults > 0) {
            sortList(targetSort);
        }

    }

    if (list) {

        let errorMessage = list.querySelector('.error');
   
        if (errorMessage){
            
            // If there are no positive results, reveal the error message
            if (positiveResults === 0) {
                list.querySelector('.error').removeAttribute('hidden');
    
            // Otherwise, hide the error message
            } else {
                list.querySelector('.error').setAttribute('hidden', '');
            }
        }

    }
}


/**
 * Sort list
 * @param  {Object} targetSort The sort object containing the following data
 * @param  {String} targetSort.type The sort type
 * @param  {Node} targetSort.list The sort list container
 * @param  {Node} targetSort.sublists The sort sublist containers
 * @param  {Nodelist} targetSort.items The sort list items
 */
let sortList = function(targetSort) {

    let {type, list, sublists, items} = targetSort;

    if (type.list) {

        console.log(`Sorting List by ${type.list.id}`);

        console.log('list', list.dataset);

        // Remove cloned items
        [...list.querySelectorAll('[data-clone]')].forEach((item) => item.remove());

        // Reset items list
        items = list.querySelectorAll('[data-item]');

        // Filter list to only include active (shown) items
        items = Array.from(items).filter((item) => {
            return !item.hasAttribute('hidden');
        })

        // If list has sublists and there is no sublist sort defined, hide them
        if (sublists && !type.sublist) {
            for (let sublist of sublists){
                sublist.setAttribute('hidden', '');
            }
        }

        // If sorting by priority,
        if (type.list.id === 'byPriority'){

            // Presort the list alphabetically
            items.sort((a,b) => {
                a = a.dataset.title;
                b = b.dataset.title;
                if (a < b) return -1;
                if (a > b) return 0;
                return 0;
            })

            // Ensure all items have priority assigned
            for (let item of items) {
                if (!item.dataset.priority) {
                    item.dataset.priority = 0;
                }
            }

        }

        items.sort((a,b) => {
            if (type.list.id === 'byName'){
                a = a.dataset.title;
                b = b.dataset.title;
                if (a < b) return -1;
                if (a > b) return 0;
                return 0;
            } else if (type.list.id === 'byDate'){
                a = Date.parse(a.dataset.date);
                b = Date.parse(b.dataset.date);
                return b - a;
            } else if (type.list.id === 'byDateNumAsc'){
                a = a.dataset.date;
                b = b.dataset.date;
                return a - b;
            } else if (type.list.id === 'byDateNumDesc'){
                a = a.dataset.date;
                b = b.dataset.date;
                return b - a;
            } else if (type.list.id === 'byPriority'){
                a = a.dataset.priority;
                b = b.dataset.priority;
                return b - a;
            }
        
        })

        if (list.hasAttribute('data-list-priority-selected')) {
            console.log('Priority Sorting');
            items.sort((a,b) => {
                a = a.querySelector(':checked') ? 1 : 0;
                b = b.querySelector(':checked') ? 1 : 0;
                return b - a;
            })
        }

        // If sorting by priority, add each item to the bottom of the list
        // * this accounts for the rounded corner styling of the article search bar *
        if (type.list.id === 'byPriority'){

            items.forEach((elem) => {
                list.lastElementChild.after(elem);
            });

        // Otherwise, reverse the results and add each sorted item to the top of the list
        } else {

            items.reverse().forEach((elem) => {
                list.firstElementChild.before(elem);
            })

        }   

    }

    if (type.sublist){

        console.log(`Sorting List by ${type.sublist.id}`);

        // Update sort object
        targetSort.items = items;

        sortBySublist(targetSort);

    }
}

/**
 * Sort list items by group
 * @param  {Object} targetSort The sort object containing the following data
 * @param  {String} targetSort.type The sort type
 * @param  {Node} targetSort.sublists The sort sublist containers
 * @param  {Nodelist} targetSort.items The sort list items
 */
let sortBySublist = function(targetSort) {

    let {type, sublists, items} = targetSort;

    if (type.sublist.id === 'byName') {

        for (let sublist of sublists) {

            // Get the sublist bin
            let bin = sublist.querySelector('[data-sublist-bin]') ? sublist.querySelector('[data-sublist-bin]') : sublist;

            // Get the sublist name
            let name = sublist.dataset.sublistName;

            for (let item of items) {

                // If the item is a clone, skip
                if (item.hasAttribute('data-clone')) continue;
                
                // If the item has no sublists assigned and the current bin in 'uncollected', add the item
                if (item.dataset.sublists === undefined
                    && name === 'Uncollected'){
                    bin.append(item);
                
                // Otherwise, if the item has sublists assigned and they include the current bin, add the item
                } else if (item.dataset.sublists !== undefined 
                    && JSON.parse(item.dataset.sublists).includes(name)){

                    // Get the sublist, if the item is in one
                    let closestSublist = item.closest('[data-sublist]');
                    
                    // If the item is already in another sublist, clone it
                    if (closestSublist && closestSublist.dataset.sublistName !== name){

                        let clone = item.cloneNode(true);
                        clone.setAttribute('data-clone', '');
                        bin.append(clone);

                    // Otherwise, move it
                    } else {
                        bin.append(item);
                    }
                }
            }

            // If a sublist contains at least one item, show it and update the counter
            if (bin.querySelectorAll('[data-item]:not([hidden])').length > 0) {
            
                sublist.removeAttribute('hidden');

                // Get the counter
                let counter = sublist.querySelector('.counter');

                if (counter){        
                    let children = sublist.querySelectorAll('[data-item]:not([hidden])');
                    counter.innerHTML = children.length;
                }
            
            // Otherwise, hide it
            } else {
                sublist.setAttribute('hidden', '');
            }
        }
    }
}

/**
 * Search list
 * @param  {Object} targetSearch The filter object containing the following data
 */
let searchList = function(targetSearch) {

    let {input, value, type, list, items, sort} = targetSearch;

    let stopWords = ['a', 'an', 'and', 'are', 'aren\'t', 'as', 'by', 'can', 'cannot', 'can\'t', 'could', 'couldn\'t', 'how', 'is', 'isn\'t', 'it', 'its', 'it\'s', 'that', 'the', 'their', 'there', 'they', 'they\'re', 'them', 'to', 'too', 'us', 'very', 'was', 'we', 'well', 'were', 'what', 'whatever', 'when', 'whenever', 'where', 'with', 'would', 'yet', 'you', 'your', 'yours', 'yourself', 'yourselves', 'the'];

    // Create a regex for each query
    let regMap = value.toLowerCase().split(' ').filter((word) => {
        return word.length && !stopWords.includes(word);
    }).map((word) => {
        return new RegExp(word, 'i');
    });
    
    // Get and sort the results
    let results = Array.from(items).reduce((results, item) => {

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
                    if (word.toLowerCase().startsWith(value.toLowerCase())) {

                        // If so, add to priority
                        priority += 1000;
    
                    }
                });                
            }
        }

        // If any matches, push to results
        if (priority > 0) {
            item.setAttribute('data-priority', priority);
            results.push(item);
        }

        return results;

    }, []);

    // Display the results
    filterList({
        input: input,
        values: results.map((item) => {
            return item.dataset.title.toLowerCase();
        }),
        type: type,
        list: list,
        items: items,
        sort: sort 
    });

}


let createInputObject = function(target, objType) {
            
    if(!target || !objType) return;
    
    let obj = {};

    let group = target.closest(`[data-${objType}-group]`);

    obj.input = target;

    // Set value(s)
    if (objType === 'search') obj.value = target.value; 
    if (objType === 'filter') obj.values = Array.from(group.querySelectorAll('input:checked, select')).map((input) => input.value);
    
    // Set type
    if (objType === 'search') obj.type = target.dataset.searchType;
    if (objType === 'filter') obj.type = target.dataset.filterType;
    if (objType === 'sort') obj.type = {
        list: group.dataset.sortType ? JSON.parse(group.dataset.sortType).list : JSON.parse(target.value).list,
        sublist: group.dataset.sortType ? JSON.parse(group.dataset.sortType).sublist : JSON.parse(target.value).sublist,
    }

    // Set min/max
    if (objType === 'filter') {
        obj.min = group.dataset.filterItemsMinSelected ? parseInt(group.dataset.filterItemsMinSelected) : undefined;
        obj.max = group.dataset.filterItemsMaxSelected ? parseInt(group.dataset.filterItemsMaxSelected) : undefined;
    }

    // Set list
    obj.list = document.querySelector(group.dataset[`${objType}ListSelector`]);
   
    // Set items
    obj.items = group.dataset[`${objType}ItemsSelector`] ? obj.list.querySelectorAll(group.dataset[`${objType}ItemsSelector`]) : obj.list.querySelectorAll('[data-item]');

    // Set sublists
    if (objType === 'sort') obj.sublists = group.dataset[`${objType}SublistsSelector`] ? obj.list.querySelectorAll(group.dataset[`${objType}SublistsSelector`]) : obj.list.querySelectorAll('[data-sublist]');

    // Create sort object
    let sortObj = {}

    // If a sort input is defined, capture type from it
    if (document.querySelector(group.dataset[`${objType}SortSelector`])) {
        sortObj.input = document.querySelector(group.dataset[`${objType}SortSelector`]);
        sortObj.type = {
            list: JSON.parse(sortObj.input.value).list,
            sublist: JSON.parse(sortObj.input.value).sublist
        }
    
    // Otherwise, check group for type info
    } else {
        sortObj.input = undefined;
        sortObj.type = {
            list: group.dataset[`${objType}SortType`] ? JSON.parse(group.dataset[`${objType}SortType`]).list : undefined,
            sublist: group.dataset[`${objType}SortType`] ? JSON.parse(group.dataset[`${objType}SortType`]).sublist : undefined,
        }
    }

    // Set sort list, items, and sublists

    // NEED TO FIX BELOW, TIMELINE LIFESPANS ARE GETTING MIXED UP WITH THE FILTERING OF THE

    sortObj.list = group.dataset[`${objType}SortListSelector`] ? document.querySelector(group.dataset[`${objType}SortListSelector`]) : obj.list;
    sortObj.items = group.dataset[`${objType}SortItemsSelector`] ? sortObj.list.querySelector(group.dataset[`${objType}SortItemsSelector`]) : obj.items;
    sortObj.sublists = obj.sublists;

    // Only add the sort object to search and filter
    if (objType === 'search' || objType === 'filter') obj.sort = sortObj;

    console.log(objType, obj);

    return obj;


}



//
// Inits & Event Listeners
//

document.addEventListener('input', (event) => {

    event.preventDefault;

    let target = event.target;

    if (target.matches('[data-search-trigger]')) {

        console.log('>>> SEARCH EVENT FIRES');

        let group = target.closest('[data-search-group]');
        let list = document.querySelector(group.dataset.searchListSelector);

        console.log('Search List', list);

        if (group.dataset.searchType) {

            if (group.dataset.searchType === 'fill') {

                // If the search value is greater than or equal to the min characters
                if (target.value.length >= group.dataset.searchMinCharacters) {

                    // Search and filter the list
                    searchList(createInputObject(target,'search'));

                    // Reveal the list
                    list.removeAttribute('hidden');

                // Otherwise,
                } else {

                    // Hide the list
                    list.setAttribute('hidden', '');

                }

            } else if (group.dataset.searchType === 'refine'){

                if (target.value.length >= 1) {

                    // Search and filter the list
                    searchList(createInputObject(target,'search'));

                } else {

                    let items = list.querySelectorAll(group.dataset.searchItemsSelector);
                    let selectedItems = list.querySelectorAll(`${group.dataset.searchItemsSelector}:has(:checked)`);
                    let deselectedItems = list.querySelectorAll(`${group.dataset.searchItemsSelector}:not(:has(:checked))`);

                    let max;

                    // Get the list's maximum number of visible items if defined, otherwise revert to length of list 
                    max = list.dataset.listItemsMaxVisible ? list.dataset.listItemsMaxVisible : items.length;

                    // To preserve visibility of selected items, remove number from max
                    max = Number(max) - Number(selectedItems.length);

                    // Show and hide items
                    for (let i = 0; i < deselectedItems.length; i++) {
                        if (i < max){
                            deselectedItems[i].removeAttribute('hidden');
                        } else {
                            deselectedItems[i].setAttribute('hidden', '');
                        }
                    }

                    sortList(createInputObject(target, 'sort'));

                }

            }
        }

    }

    if (target.matches('[data-filter-trigger]')) {
        console.log('>>> FILTER EVENT FIRES');
        updateInputStates(createInputObject(target, 'filter'));
        filterList(createInputObject(target, 'filter'));
    }

    if (target.matches('[data-sort-trigger')) {
        console.log('>>> SORT EVENT FIRES');
        sortList(createInputObject(target, 'sort'));
    }

})


document.addEventListener('submit', (event) => {

    // Prevents default submit server call and triggers search function
    event.preventDefault();

    let target = event.target;

    if (target.matches('[data-search-trigger')) {

        let group = target.closest('[data-search-group]');
        let input = group.querySelector('input');
        let list = group.querySelector(group.dataset.searchListSelector);
        let items = group.dataset.searchItemsSelector ? list.querySelectorAll(group.dataset.searchItemsSelector) : list.querySelectorAll('[data-item]');
        let sublists = group.dataset.searchSublistsSelector ? list.querySelectorAll(group.dataset.searchSublistsSelector) : list.querySelectorAll('[data-sublist]');

        searchList({
            input: input,
            value: input.value,
            type: input.dataset.searchType,
            list: list,
            items: items,
            sort: {
                list: list,
                items: items,
                type: {
                    list: group.dataset.sort ? JSON.parse(group.dataset.sort).list : undefined,
                    sublist: group.dataset.sort ? JSON.parse(group.dataset.sort).sublist : undefined
                },
                sublists: sublists ? sublists : undefined
            }
        });

        list.removeAttribute('hidden');

    }
})


document.addEventListener('keydown', (event) => {

    // Only run on arrow down and up
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    let target = event.target;
    let group = target.closest('[data-search-group]');

    // If the target is nested inside a search form
    if (group && group.matches('#search-articles')) {
        
        let activeElement = document.activeElement;
        let input = group.querySelector('[data-search-trigger]');
        let list = group.querySelector('[data-list]');

        if (event.key === "ArrowDown"){

            event.preventDefault();

            if (activeElement.matches('input')){
                let targetElem = list.querySelector('[data-item]:not([hidden]) a');
                targetElem.focus();

            } else if (activeElement.matches('a')) {
                let targetElem = activeElement.closest('[data-item]').nextElementSibling;
                if (targetElem) {
                    targetElem.querySelector('a').focus();
                }
            }
            
        } else if (event.key === "ArrowUp"){

            event.preventDefault();

            if (activeElement.matches('a')) {
                let targetElem = activeElement.closest('[data-item]').previousElementSibling;
                if (targetElem && !targetElem.hasAttribute('hidden')) {
                    targetElem.querySelector('a').focus();
                } else {
                    input.focus();
                }
            }

        }

    }

})

// TIMELINE - UNDER CONSTRUCTION
document.addEventListener('click', (event) => {

    let target = event.target;

    if (target.matches('.show-more')){

        let list = target.closest('[data-list]') ? target.closest('[data-list]') : target.parentElement.querySelector('[data-list]');

        console.log(list, target.parentElement);
        
        if (!list) return;

        let max = list.dataset.listItemsMaxVisible;
        let increment = list.dataset.listExtensionIncrement;

        max = Number(max) + Number(increment);

        list.dataset.listItemsMaxVisible = max;

        let hiddenItems = list.querySelectorAll('[data-item][hidden]');

        if (hiddenItems.length > 0){

            for (let i = 0; i < hiddenItems.length && i < increment; i++) {

                // Show the item
                hiddenItems[i].removeAttribute('hidden');

                // Set the item priority to zero so they flow to the bottom of the list
                hiddenItems[i].setAttribute('data-priority', 0);
            }

        }

        sortList(createInputObject(target, 'sort'));

    }

})


// Check url for query string parameters
let params = getParams();

// Get filter groups
let filterGroups = document.querySelectorAll('[data-filter-group]');

// If url contains parameters,
if (params.filter && filterGroups.length > 0){

    // Check to see if the page contains a matching filter group
    for (const group of filterGroups){
        let inputs = group.querySelectorAll('input');
        let target = group.querySelector(`input[value="${params.filter}"]`)

        // If it does, apply the filter
        if (target) {

            // Remove the checked attribute to account for pre-checked filters
            for (const input of inputs){
                input.removeAttribute('checked');
            }

            updateInputStates(createInputObject(target, 'filter'));
            filterList(createInputObject(target, 'filter'));

        }
    }
}