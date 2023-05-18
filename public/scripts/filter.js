//
// Methods
//

/**
 * Filter list
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
 * Filter list
 * @param  {Node} targetFilter The filter to apply
 * @param  {Node} targetList The list
 */
let filterList = function(targetFilter, targetList) {

    console.log('Filtering');

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

    // Get the list items
    let listItems = targetList.querySelectorAll('li');

    for (const item of listItems) {

        // Store the item category
        let category = item.dataset.category.toLowerCase();

        if (targetFilter.type === 'radio'){         

            // If filter is bookmark, check bookmark state and show or hide accordingly
            if (targetFilter.value === 'bookmarks'){
                if (item.hasAttribute('data-bookmark')){
                    item.removeAttribute('hidden');
                } else {
                    item.setAttribute('hidden', '');
                }

            // If filter is all, show all items
            } else if (targetFilter.value === 'all'){
                item.removeAttribute('hidden');

            // If filter is category, check item category and show or hide accordingly
            } else {
                if (category !== targetFilter.value){
                    item.setAttribute('hidden', '');
                } else {
                    item.removeAttribute('hidden');
                } 
            }

        } else if (targetFilter.type === 'checkbox'){

            console.log('Setting attributes', targetFilter, category);

            let activeFilters = [];
            for (const input of targetFilter.closest('form').querySelectorAll('input[checked]')) {
                activeFilters.push(input.value);
            }

            if (activeFilters.includes(category)){
                item.removeAttribute('hidden');
            } else {
                item.setAttribute('hidden', '');
            }

        }
        
    }

    let sortSelect = targetList.closest('section').querySelector('select[name="sort"]');
    console.log(sortSelect.value);

    if (sortSelect) {

        sortList(sortSelect.value, targetList);

    } else {

        let sortType;

        if (listItems[0].dataset.contains('date') && typeof listItems[0].dataset.date == 'number') { sortType = 'byDateNumDesc' }
        else if (listItems[0].dataset.contains('date') && typeof listItems[0].dataset.date == 'string') { sortType = 'byDate' }
        else if (listItems[0].dataset.contains('title')) { sortType = 'byTitle' }

        console.log(sortType);

        if (sortType !== undefined) {
            sortList(sortType, targetList)
        }
        
    }

    

}

/**
 * Sort list
 * @param  {Node} targetSort The param to sort the filter by
 * @param  {Node} targetList The list
 */
let sortList = function(targetSort, targetList) {

    // Get the list items
    let listItems = targetList.querySelectorAll('li:not([hidden])');

    Array.from(listItems).sort((a,b) => {
        if (targetSort === 'byTitle'){
            a = a.dataset.title;
            b = b.dataset.title;
            if (a < b) return -1;
            if (a > b) return 0;
            return 0;
        } else if (targetSort === 'byDate'){
            a = Date.parse(a.dataset.date);
            b = Date.parse(b.dataset.date);
            return b - a;
        } else if (targetSort === 'byDateNumAsc'){
            a = a.dataset.date;
            b = b.dataset.date;
            return a - b;
        } else if (targetSort === 'byDateNumDesc'){
            a = a.dataset.date;
            b = b.dataset.date;
            return b - a;
        }
    
    // Reverse the list to compensate for insertBefore
    }).reverse().forEach((elem) => {

        // Add each sorted item to the top of the list
        targetList.insertBefore(elem, targetList.firstChild);

    })

}



//
// Inits & Event Listeners
//

let filterGroups = document.querySelectorAll('.filter-group');
let sortGroups = document.querySelectorAll('.sort-group');

for (const group of filterGroups){
    group.addEventListener('input', (event) => {
        event.preventDefault;
        filterList(event.target, group.closest('section').querySelector('.list'));
    });
}

for (const group of sortGroups){
    group.addEventListener('input', (event) => {
        sortList(event.target.value, group.closest('section').querySelector('.list'));
    });
}


// Check url for query string parameters
let params = getParams();

if (params.filter){
    for (const group of filterGroups){
        let inputs = group.querySelectorAll('input');
        let targetInput = group.querySelector(`input[value="${params.filter}"]`)
        if (targetInput) {
            // Remove the checked attribute to account for pre-checked filters
            for (const input of inputs){
                input.removeAttribute('checked');
            }
            filterList(targetInput, group.closest('section').querySelector('.list'));
        }
    }
}


