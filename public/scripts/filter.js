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

        // Store the item category and bookmark state
        let category = item.dataset.category.toLowerCase();

        // If filter is bookmark, check bookmark state and show or hide accordingly
        if (targetFilter === 'bookmarks'){
            if (item.hasAttribute('data-bookmark')){
                item.removeAttribute('hidden');
            } else {
                item.setAttribute('hidden', '');
            }

        // If filter is all, show all items
        } else if (targetFilter === 'all'){
            item.removeAttribute('hidden');

        // If filter is category, check item category and show or hide accordingly
        } else {
            if (category !== targetFilter){
                item.setAttribute('hidden', '');
            } else {
                item.removeAttribute('hidden');
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

let filters = document.querySelector('#filters');
let sort = document.querySelector('#sort');
let list = document.querySelector('#list');

filters.addEventListener('input', (event) => {
    filterList(event.target.value, list);
});
sort.addEventListener('input', (event) => {
    sortList(event.target.value, list);
});

// Check url for query string parameters
let params = getParams();

if (params.filter){
    filters.querySelector(`input[value="${params.filter}"]`).checked = true;
    filterList(params.filter, list);
}
