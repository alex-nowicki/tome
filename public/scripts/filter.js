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

    let input = targetFilter.input;

    // Update checked state on input
    if (input.type === 'radio'){

        if (input.hasAttribute('checked')) {
            input.removeAttribute('checked');
        } else {
            for (const filter of input.closest('form').querySelectorAll('input[type="radio"]')) {
                filter.removeAttribute('checked');
            }
            input.setAttribute('checked', '');
        }

    } else if (input.type === 'checkbox'){

        let clones = [...input.closest('form').querySelectorAll(`[value="${input.value}"]`)];

        // If there are clones,
        if (clones.length > 1) {

            // Get the original input
            for (let clone of clones) {
                if (!clone.closest('[data-clone]')) {
                    input = clone;
                    break;
                }
            }
        } 

        if (input.hasAttribute('checked')) {
            input.checked = false;
            input.removeAttribute('checked');
        } else {
            input.checked = true;
            input.setAttribute('checked', '');
        }   

        let checkedBoxes = input.closest('form').querySelectorAll(':not([data-clone]) input[type="checkbox"]:checked');
        let uncheckedBoxes = input.closest('form').querySelectorAll(':not([data-clone]) input[type="checkbox"]:not(:checked)');

        // If a minimum of active boxes is defined,
        if (targetFilter.min && checkedBoxes.length <= targetFilter.min) {

            // Disable checked boxes
            for (const box of checkedBoxes) {
                box.setAttribute('disabled', '');
            }

        // Otherwise, enable checked boxes
        } else {
            for (const box of checkedBoxes) {
                box.removeAttribute('disabled');
            }
        }

        // If a maximum number of active boxes is defined,
        if (targetFilter.max && uncheckedBoxes.length >= targetFilter.max) {

            // Disable unchecked boxes
            for (const box of uncheckedBoxes) {
                box.setAttribute('disabled', '');
            }

        // Otherwise, enable unchecked boxes
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
 * @param  {Node} targetFilter.input The input target
 * @param  {Array} targetFilter.values The form values
 * @param  {String} targetFilter.type The filter type
 * @param  {Node} targetFilter.list The filter list container
 * @param  {Nodelist} targetFilter.items The filter list items
 * @param  {Node} targetFilter.sort The paired sort group, if available
 */
let filterList = function(targetFilter) {

    // console.log('targetFilter', targetFilter);

    updateInputStates(targetFilter);

    let positiveResults = 0;

    for (const item of targetFilter.items) {

        // If the item has a button, and the button is pressed, skip
        if (item.closest('[data-sublist]') && item.closest('[data-sublist]').hasAttribute('data-filter-ignore')) {   
             console.log('Skipping'); 
             continue; 
        }

        if (targetFilter.type === 'category'){

            // Store the item category
            let category = item.dataset.category.toLowerCase();

            // Check item category and show or hide accordingly
            if (targetFilter.values.includes(category)){
                item.removeAttribute('hidden');
                positiveResults += 1;
            } else {
                item.setAttribute('hidden', '');
            }

        } else if (targetFilter.type === 'title'){

            // Store the item title
            let title = item.dataset.title.toLowerCase();

            // Check item title and show or hide accordingly
            if (targetFilter.values.includes(title)){
                item.removeAttribute('hidden');
                positiveResults += 1;
            } else {
                item.setAttribute('hidden', '');
            }

        } else if (targetFilter.type === 'bookmark'){

            // Check bookmark state and show or hide accordingly
            if (item.hasAttribute('data-bookmark')){
                item.removeAttribute('hidden');
                positiveResults += 1;
            } else {
                item.setAttribute('hidden', '');
            }

        } else if (targetFilter.type === 'all'){

            // Show all items
            item.removeAttribute('hidden');
            positiveResults += 1;

        }
        
    }

    if (targetFilter.sort) {

        let targetSort = targetFilter.sort;
    
        if (targetSort.input) {
            targetSort.type = JSON.parse(targetSort.input.value);
        }

        if (targetSort.type !== undefined && positiveResults > 0) {
            sortList(targetSort);
        }

    }

    if (targetFilter.list) {

        let errorMessage = targetFilter.list.querySelector('.error');
   
        if (errorMessage){
            
            // If there are no positive results,
            // if (positiveResults === 0 && !targetFilter.list.querySelector(':checked') && errorMessage !== undefined) {
            if (positiveResults === 0) {
    
                // Reveal the error message
                targetFilter.list.querySelector('.error').removeAttribute('hidden');
    
            } else {
                // Reveal the error message
                targetFilter.list.querySelector('.error').setAttribute('hidden', '');
            }
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

    console.log('targetSort', targetSort);

    if (targetSort.type.list) {

        // Remove cloned items
        [...targetSort.list.querySelectorAll('[data-clone]')].forEach((item) => item.remove());

        // Reset items list
        targetSort.items = targetSort.list.querySelectorAll('[data-item]');

        // Filter list to only include active (shown) items
        targetSort.items = Array.from(targetSort.items).filter((item) => {
            return !item.hasAttribute('hidden');
        })

        // If list has sublists and there is no sublist sort defined, hide them
        if (targetSort.sublists && !targetSort.type.sublist) {
            for (let sublist of targetSort.sublists){
                sublist.setAttribute('hidden', '');
            }
        }

        targetSort.items.sort((a,b) => {
            if (targetSort.type.list.id === 'byName'){
                a = a.dataset.title;
                b = b.dataset.title;
                if (a < b) return -1;
                if (a > b) return 0;
                return 0;
            } else if (targetSort.type.list.id === 'byDate'){
                a = Date.parse(a.dataset.date);
                b = Date.parse(b.dataset.date);
                return b - a;
            } else if (targetSort.type.list.id === 'byDateNumAsc'){
                a = a.dataset.date;
                b = b.dataset.date;
                return a - b;
            } else if (targetSort.type.list.id === 'byDateNumDesc'){
                a = a.dataset.date;
                b = b.dataset.date;
                return b - a;
            } else if (targetSort.type.list.id === 'byPriority'){
                a = a.dataset.priority;
                b = b.dataset.priority;
                return b - a;
            }
        
        })

        // If sorting by priority, add each item to the bottom of the list
        // * this accounts for the rounded corner styling of the article search bar *
        if (targetSort.type.list.id === 'byPriority'){

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

    if (targetSort.type.sublist){

        sortBySublist(targetSort);

    }

}

/**
 * Sort list items by group
 * @param  {Object} targetSort The sort object containing the following data
 * @param  {Node} targetSort.list The sort list container
 * @param  {Nodelist} targetSort.items The sort list items
 */
let sortBySublist = function(targetSort) {

    // if (targetSort.type.sublist.id === 'byCondition'){

    //     // Get the true and false sublists
    //     let trueSublist = targetSort.list.querySelector('[data-sublist-true]');
    //     let falseSublist = targetSort.list.querySelector('[data-sublist-false]');

    //     // Get the bins
    //     let trueBin = trueSublist.querySelector('[data-sublist-bin]') ? trueSublist.querySelector('[data-sublist-bin]') : trueSublist;
    //     let falseBin = falseSublist.querySelector('[data-sublist-bin]') ? falseSublist.querySelector('[data-sublist-bin]') : falseSublist;

    //     console.log(trueBin, falseBin);

    //     for (let item of targetSort.items) {

    //         // If the item meets the condition add it to the true bin
    //         if (item.matches(targetSort.type.sublist.condition)){

    //             // If settings require a clone, clone it
    //             if (targetSort.type.sublist.clone === true) {
    //                 let clone = item.cloneNode(true);
    //                 clone.setAttribute('data-clone', '');
    //                 trueBin.append(clone);

    //             // Otherwise, move it
    //             } else {
    //                 trueBin.append(item);
    //             }

    //         // Otherwise, add it to the false bin
    //         } else {
    //             falseBin.append(item);
    //         }

    //     }

    // } else if (targetSort.type.sublist.id === 'byName') {
    if (targetSort.type.sublist.id === 'byName') {

        for (let sublist of targetSort.sublists) {

            // Get the sublist bin
            let bin = sublist.querySelector('[data-sublist-bin]') ? sublist.querySelector('[data-sublist-bin]') : sublist;

            // Get the sublist name
            let name = sublist.dataset.sublistName;

            for (let item of targetSort.items) {

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

        }

    }

    for (let sublist of targetSort.sublists) {

        let bin = sublist.querySelector('[data-sublist-bin]') ? sublist.querySelector('[data-sublist-bin]') : sublist;

        // If a sublist contains at least one item, show it
        if (bin.querySelectorAll('[data-item]:not([hidden])').length > 0 || !bin.querySelector('.error').hasAttribute('hidden')) {
            sublist.removeAttribute('hidden')
        
        // Otherwise, hide it
        } else {
            sublist.setAttribute('hidden', '');
        }

    }

    for (let sublist of targetSort.sublists) {

        let counter = sublist.querySelector('.counter');

        if (counter){

            let children = sublist.querySelectorAll('[data-item]:not([hidden])');

            counter.innerHTML = children.length;

        }

        let errorMessage = sublist.querySelector('.error');
   
        // if (errorMessage){
            
        //     // If there are no positive results,
        //     if (errorMessage !== undefined) {
    
        //         // Reveal the error message
        //         sublist.querySelector('.error').removeAttribute('hidden');
    
        //     } else {
        //         // Reveal the error message
        //         sublist.querySelector('.error').setAttribute('hidden', '');
        //     }
        // }

    }

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

    // Display the results
    filterList({
        input: targetSearch.input,
        values: results.map((item) => {
            return item.dataset.title.toLowerCase();
        }),
        type: targetSearch.type,
        list: targetSearch.list,
        items: targetSearch.items,
        sort: targetSearch.sort 
    });

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
        let input = group.querySelector('input');
        let list = document.querySelector(group.dataset.searchListSelector);
        let items = group.dataset.searchItemsSelector ? list.querySelectorAll(group.dataset.searchItemsSelector) : list.querySelectorAll('[data-item]');
        let sublists = group.dataset.searchSublistsSelector ? list.querySelectorAll(group.dataset.searchSublistsSelector) : list.querySelectorAll('[data-sublist]');

        if (input.value.length > 2){
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
                        list: group.dataset.searchSortType ? JSON.parse(group.dataset.searchSortType).list : undefined,
                        sublist: group.dataset.searchSortType ? JSON.parse(group.dataset.searchSortType).sublist : undefined
                    },
                    sublists: sublists ? sublists : undefined
                }
            });
            list.removeAttribute('hidden');
        } else if (!list.querySelector(":checked")) {
            list.setAttribute('hidden', '');
        }

    }

    if (target.matches('[data-filter-trigger')) {

        console.log('>>> FILTER EVENT FIRES');

        let group = target.closest('[data-filter-group]');
        let list = document.querySelector(group.dataset.filterListSelector);
        let items = group.dataset.filterItemsSelector ? list.querySelectorAll(group.dataset.filterItemsSelector) : list.querySelectorAll('[data-item]');
        let sublists = group.dataset.filterSublistsSelector ? list.querySelectorAll(group.dataset.filterSublistsSelector) : list.querySelectorAll('[data-sublist]');
        let sort = document.querySelector(group.dataset.filterSortSelector);

        console.log(sort);

        filterList({
            input: event.target,
            values: Array.from(group.querySelectorAll('input:checked, select')).map((input) => input.value),
            type: event.target.dataset.filterType,
            min: group.dataset.filterMin ? parseInt(group.dataset.filterMin) : undefined,
            max: group.dataset.filterMax ? parseInt(group.dataset.filterMax) : undefined,
            list: list,
            items: items,
            sort: {
                input: sort ? sort : undefined,
                type: {
                    list: sort ? JSON.parse(sort.value).list : undefined,
                    sublist: sort ? JSON.parse(sort.value).sublist : undefined
                },
                list: list,
                items: items,
                sublists: sublists ? sublists : undefined
            }
        });

    }

    if (target.matches('[data-sort-trigger')) {

        console.log('>>> SORT EVENT FIRES');

        let group = target.closest('[data-sort-group]');
        let list = document.querySelector(group.dataset.sortListSelector);
        let items = group.dataset.sortItemsSelector ? list.querySelectorAll(group.dataset.sortItemsSelector) : list.querySelectorAll('[data-item]');
        let sublists = group.dataset.sortSublistsSelector ? list.querySelectorAll(group.dataset.sortSublistsSelector) : list.querySelectorAll('[data-sublist]');

        sortList({
            input: event.target,
            type: {
                list: group.dataset.sortType ? JSON.parse(group.dataset.sortType).list : JSON.parse(event.target.value).list,
                sublist: group.dataset.sortType ? JSON.parse(group.dataset.sortType).sublist : JSON.parse(event.target.value).sublist
            },
            list: list,
            items: items,
            sublists: sublists ? sublists : undefined
        })


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

    let target = event.target;
    let group = target.closest('[data-search-group]');

    if (group.matches('#search-articles')) {
        
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

            let list = document.querySelector(group.dataset.listSelector);
            let items = list.querySelectorAll('[data-item]');

            filterList({
                input: targetInput,
                values: [params.filter],
                type: targetInput.dataset.type,
                list: list,
                items: items
            });
        }
    }
}


