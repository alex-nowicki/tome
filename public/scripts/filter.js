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

            // if filter is checked and category matches the item, show the item
            if (targetFilter.checked && category === targetFilter.value){
                item.removeAttribute('hidden');

            // Otherwise, hide the item
            } else if (!targetFilter.checked && category === targetFilter.value) {
                item.setAttribute('hidden', '');
            }

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
    let listItems = targetList.querySelectorAll('li');

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
        }        
    }).forEach((elem) => {
        targetList.appendChild(elem);
    })

}



//
// Inits & Event Listeners
//

let filterGroups = document.querySelectorAll('.filter-group');
let sortGroups = document.querySelectorAll('.sort-group');

for (const group of filterGroups){
    group.addEventListener('input', (event) => {
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
    filters.querySelector(`input[value="${params.filter}"]`).checked = true;
    filterList(params.filter, list);
}
