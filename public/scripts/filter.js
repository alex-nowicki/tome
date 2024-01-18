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
    if (targetFilter.input.type === 'radio'){

        if (targetFilter.input.hasAttribute('checked')) {
            targetFilter.input.removeAttribute('checked');
        } else {
            for (const filter of targetFilter.input.closest('form').querySelectorAll('input[type="radio"]')) {
                filter.removeAttribute('checked');
            }
            targetFilter.input.setAttribute('checked', '');
        }

    } else if (targetFilter.input.type === 'checkbox'){

        if (targetFilter.input.hasAttribute('checked')) {
            targetFilter.input.removeAttribute('checked');
        } else {
            targetFilter.input.setAttribute('checked', '');
        }

        let checkboxes = targetFilter.input.closest('form').querySelectorAll('input[type="checkbox"]');
        let checkedCheckboxes = targetFilter.input.closest('form').querySelectorAll('input[type="checkbox"]:checked');

        if ((targetFilter.min && checkedCheckboxes.length <= targetFilter.min) || (targetFilter.max && checkedCheckboxes.length >= targetFilter.max)) {
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

    console.log('targetFilter', targetFilter);

    updateInputStates(targetFilter);

    let positiveResults = 0;

    for (const item of targetFilter.items) {

        // If the item has a button, and the button is pressed, skip
        if (item.querySelector(':checked')) continue;

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
            if (positiveResults === 0 && !targetFilter.list.querySelector(':checked') && errorMessage !== undefined) {
    
                // Reveal the error message
                targetFilter.list.querySelector('.error').removeAttribute('hidden');
    
            } else {
                // Reveal the error message
                targetFilter.list.querySelector('.error').setAttribute('hidden', '');
            }
        }

        let counter = targetFilter.list.querySelector('.counter');

        if (counter){

            counter.innerHTML = positiveResults;

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

    console.log('targetSort at start of function', targetSort);

    // Remove cloned items
    [...targetSort.list.querySelectorAll('[data-clone]')].forEach((item) => item.remove());

    // Reset items list
    targetSort.items = targetSort.list.querySelectorAll('[data-item]');

    // Filter list to only include active (shown) items
    targetSort.items = Array.from(targetSort.items).filter((item) => {
        return !item.hasAttribute('hidden');
    })

    if (targetSort.type.sublist){

        sortBySublist(targetSort);

    } else {

        // If no sort option is defined, bail
        if (!targetSort.type.list) return;

        // If list has sublists, hide them
        if (targetSort.sublists) {
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

        let targetContainer = targetSort.list;

        // If items are in a sublist, determine which container to append it to
        if (targetSort.type.sublist) {
            if (targetSort.items[0].closest('[data-sublist-bin')) {
                targetContainer = targetSort.items[0].closest('[data-sublist-bin');
            } else {
                targetContainer = targetSort.items[0].closest('[data-sublist');
            }
        }
        
        // If sorting by priority, add each item to the bottom of the list
        if (targetSort.type.list.id === 'byPriority'){

            targetSort.items.forEach((elem) => {
                targetContainer.lastElementChild.after(elem);
            });

        // Otherwise, reverse the results and add each sorted item to the top of the list
        } else {

            targetSort.items.reverse().forEach((elem) => {
                targetContainer.firstElementChild.before(elem);
            })
        }

    }

}

/**
 * Sort list items by group
 * @param  {Object} targetSort The sort object containing the following data
 * @param  {Node} targetSort.list The sort list container
 * @param  {Nodelist} targetSort.items The sort list items
 */
let sortBySublist = function(targetSort) {

    console.log('items start of sort by sublist', targetSort.items.length);

    if (targetSort.type.sublist.id === 'byCondition'){

        // Get the true bin
        let trueBin = targetSort.list.querySelector('[data-sublist-true]');
        let falseBin = targetSort.list.querySelector('[data-sublist-false]');

        for (let item of targetSort.items) {

            console.log(targetSort.type.sublist)

            // If the item meets the condition, move it into the true group
            if (item.matches(targetSort.type.sublist.condition)){

                trueBin.append(item);
            } else {
                console.log('does not meet condition');
                falseBin.append(item);
            }

        }

    } else {

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

            // If the sublist contains at least one item, show it
            if (bin.querySelectorAll('[data-item]:not([hidden])').length > 0) {
                sublist.removeAttribute('hidden')
            
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

                        console.log('Start with priority', item);

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

let filterGroups = document.querySelectorAll('.filter-group');
let sortGroups = document.querySelectorAll('.sort-group');
let searchGroups = document.querySelectorAll('.search-group');

for (const group of filterGroups){
    group.addEventListener('input', (event) => {
        event.preventDefault;

        console.log('Start of filter click event');

        let list = document.querySelector(group.dataset.listSelector);
        let items = group.dataset.itemsSelector ? list.querySelectorAll(group.dataset.itemsSelector) : list.querySelectorAll('[data-item]');
        let sublists = group.dataset.sublistsSelector ? list.querySelectorAll(group.dataset.sublistsSelector) : list.querySelectorAll('[data-sublist]');
        let sort = document.querySelector(`${group.dataset.sortSelector}`);

        filterList({
            input: event.target,
            values: Array.from(group.querySelectorAll('input:checked, select')).map((input) => input.value),
            type: event.target.dataset.type,
            min: group.dataset.min ? parseInt(group.dataset.min) : undefined,
            max: group.dataset.max ? parseInt(group.dataset.max) : undefined,
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
    });
}

for (const group of sortGroups){
    group.addEventListener('input', (event) => {
        event.preventDefault;

        console.log('Start of sort click event');

        let list = document.querySelector(group.dataset.listSelector);
        let items = group.dataset.itemsSelector ? list.querySelectorAll(group.dataset.itemsSelector) : list.querySelectorAll('[data-item]');
        let sublists = group.dataset.sublistsSelector ? list.querySelectorAll(group.dataset.sublistsSelector) : list.querySelectorAll('[data-sublist]');

        console.log(items);

        sortList({
            input: event.target,
            type: {
                list: group.dataset.sort ? JSON.parse(group.dataset.sort).list : JSON.parse(event.target.value).list,
                sublist: group.dataset.sort ? JSON.parse(group.dataset.sort).sublist : JSON.parse(event.target.value).sublist
            },
            list: list,
            items: items,
            sublists: sublists ? sublists : undefined
        })
    });
}

for (const group of searchGroups){

    group.addEventListener('input', function(event){

        let input = group.querySelector('input');
        let list = group.querySelector(group.dataset.listSelector);
        let items = group.dataset.itemsSelector ? list.querySelectorAll(group.dataset.itemsSelector) : list.querySelectorAll('[data-item]');
        let sublists = group.dataset.sublistsSelector ? list.querySelectorAll(group.dataset.sublistsSelector) : list.querySelectorAll('[data-sublist]');

        if (input.value.length > 2){
            searchList({
                input: input,
                value: input.value,
                type: input.dataset.type,
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
        } else if (!list.querySelector(":checked")) {
            list.setAttribute('hidden', '');
        }
    })

    group.addEventListener('submit', (event) => {
        // Prevents default submit server call and triggers search function
        event.preventDefault();

        let input = group.querySelector('input');
        let list = group.querySelector(group.dataset.listSelector);
        let items = group.dataset.itemsSelector ? list.querySelectorAll(group.dataset.itemsSelector) : list.querySelectorAll('[data-item]');
        let sublists = group.dataset.sublistsSelector ? list.querySelectorAll(group.dataset.sublistsSelector) : list.querySelectorAll('[data-sublist]');

        searchList({
            input: input,
            value: input.value,
            type: input.dataset.type,
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
    })

    group.addEventListener('keydown', function(event){
        
        let activeElement = document.activeElement;
        // console.log('activeElement old', activeElement);

        if (event.key === "ArrowDown"){
            event.preventDefault();

            if (activeElement.matches('input')){
                // console.log('Down arrowing from input');
                let targetElem = list.querySelector('a');
                // console.log(targetElem);
                targetElem.focus();

            } else if (activeElement.matches('a')) {
                // console.log('Down arrowing from a');
                let targetElem = activeElement.closest('li').nextElementSibling;
                if (targetElem) {
                    targetElem.querySelector('a').focus();
                }
            }
            
        } else if (event.key === "ArrowUp"){

            if (activeElement.matches('a')) {
                // console.log('Up arrowing from a');
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


