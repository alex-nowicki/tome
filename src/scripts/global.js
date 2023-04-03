let updatePins = function (arr){
  let pinnedList = document.querySelector('.pins-panel');
  let markup = arr.map((pin) => 
  `<li><a href="${pin.url}">${pin.title}</a></li>`
  ).join('');
  console.log(markup);
  pinnedList.innerHTML = markup;
}

if (localStorage.getItem('pins')){
  updatePins(JSON.parse(localStorage.getItem('pins')));
}

document.addEventListener('click', function(event){

    let target = event.target;
    
    if (target.classList.contains('accordion-toggle')){

        let accordion = target.closest('.accordion');
        let allowMultiple = accordion.hasAttribute('data-allow-multiple');
  
        // Check if the current toggle is expanded.
        let isExpanded = target.getAttribute('aria-expanded') == 'true';
        let active = accordion.querySelector('[aria-expanded="true"]');
  
        // Close the open accordion if not active
        if (!allowMultiple && active && active !== target) {
          // Reset the active toggle
          active.setAttribute('aria-expanded', 'false');
          // Hide the accordion panel, using aria-controls to specify the desired section
          document.querySelector(`#${active.getAttribute('aria-controls')}`).setAttribute('hidden', '');
        }
  
        if (!isExpanded) {
          // Set the expanded state on the triggering element
          target.setAttribute('aria-expanded', 'true');
          // Hide the accordion sections, using aria-controls to specify the desired section
          document.querySelector(`#${target.getAttribute('aria-controls')}`).removeAttribute('hidden');
        }
  
        else if (isExpanded) {
          // Set the expanded state on the triggering element
          target.setAttribute('aria-expanded', 'false');
          // Hide the accordion sections, using aria-controls to specify the desired section
          document.querySelector(`#${target.getAttribute('aria-controls')}`).setAttribute('hidden', '');
        }
  
        // Enable collapse all button
        if (accordion.querySelector('[aria-expanded="true"]') && accordion.closest('#browse')){
          document.querySelector('#browse-collapse').disabled = false;
        }
  
        event.preventDefault();
        
    }

    if (target.classList.contains('pin-toggle')){

      let targetLink = target.closest('li').querySelector('a');      
      let post = {
        title: targetLink.innerHTML,
        url: targetLink.pathname,
        project: targetLink.pathname.split('/')[1]
      }
      console.log(post);

      let updateStorage = function (key, obj){
        // Get array of items
        let itemArr = localStorage.getItem(key);
        itemArr = JSON.parse(itemArr);
        // Check if array contains obj
        let itemIndex = itemArr.findIndex(item => item.url === obj.url);
        if (itemIndex !== -1){
          // If it contains obj, delete item from array
          console.log('item already exists');
          itemArr.splice(itemIndex, 1);
        } else {
          // Otherwise, add item to array
          console.log('item is new');
          itemArr.push(obj);
        }
    
        itemArr = JSON.stringify(itemArr);
        localStorage.setItem('pins', itemArr);
      }

      let setStorage = function (key, obj){
        let itemArr = [];
        itemArr.push(obj);
        itemArr = JSON.stringify(itemArr);
        localStorage.setItem(key, itemArr);
      }

      if (localStorage.getItem('pins')){
        console.log('updating...');
        updateStorage('pins', post);
      } else {
        console.log('creating...');
        setStorage('pins', post);
      }

      target.classList.toggle('pinned');

      updatePins(JSON.parse(localStorage.getItem('pins')));

    }


})



let sortResources = function(type){
  type.forEach(function(id, index){
    document.querySelector(`#resource${id}`).style.order = `${index}`;
  });
}

let setSortByRating = function(obj){
  let sorted = Object.keys(obj);
  sorted.sort(function(a, b){
    if (obj[b].avg == obj[a].avg){
      return obj[b].count - obj[a].count;
    } else {
      return obj[b].avg - obj[a].avg;
    }
  })
  console.log('rating obj sorted', sorted);
  return sorted;
}

let setSortByDateAdded = function(obj){
  let dates = {};
  for (const elem of obj){
    dates[elem.id] = elem.date.added;
  }
  let sorted = Object.keys(dates);
  sorted.sort(function(a, b){
    return dates[b] - dates[a];
  })
  console.log('dates obj sorted', sorted);
  return sorted;
}

let setSortByRelevance = function(arr){
  let freq = {};
  for (const elem of arr){
    if (freq[elem]){
      freq[elem] += 1;
    } else {
      freq[elem] = 1;
    }
  }
  let uniques = Object.keys(freq);
  uniques.sort(function(a, b){
    return freq[b] - freq[a];
  })
  return uniques;
}




let searchForm = document.querySelector('#search');
searchForm.addEventListener('submit', function(event){
  // Prevents default submit server call and replaces it with a click event
  event.preventDefault();
  document.querySelector('#search-submit').click();
})

let searchInput = document.querySelector('#search-field');
searchInput.addEventListener('search', function(event){

  console.log('search-event', event)
  let searchTerms = searchInput.value.toLowerCase();

  // Match regex and discard the surrounding quotation marks.
  if (searchTerms !== '') {
    console.log('regex');
    let regex = /"[^"]+"|[^\s]+/g;
    // Explanation of the regex used:
    // "[^"]+": Capture any sequence of characters (at least 1) inside two quotation marks except a quotation mark.
    // |: Logical OR.
    // [^\s]+: Capture any sequence of non-whitespace characters (at least 1).
    // g: The global flag - instruction to match all occurrences.
    searchTerms = searchTerms.match(regex).map(e => e.replace(/"(.+)"/, "$1"));
  }

  console.log('Search Terms', searchTerms);
  let links = document.querySelectorAll('#results-panel li');

  if (searchTerms !== '' && searchTerms.length > 0){
    console.log(searchTerms);
    // Sort queried resources by relevance and store in data object
    data.sort.byRelevance = searchResources(searchTerms);
    // Hide all resources
    for (const resource of resources){
      resource.classList.add('hidden');
    }
    // Show resources that match query
    data.sort.byRelevance.forEach(function(id){
      document.querySelector(`#resource${id}`).classList.remove('hidden');
    });
    // Set active sort to Relevance
    data.sort.active = 'byRelevance';
    document.querySelector('#sort-select option[value="byRelevance"]').hidden = false;
    document.querySelector('#sort-select option[value="byRelevance"]').selected = true;
    // Sort resources by Relevance
    sortResources(data.sort.byRelevance);
    // Show search result stats
    document.querySelector('.form-group .results').hidden = false;
    if (data.sort.byRelevance.length == 0){
      document.querySelector('.form-group .results p').innerHTML = `${data.sort.byRelevance.length} results. Try removing browse or keyword filters or try a different search term.`;
    } else {
      document.querySelector('.form-group .results p').innerHTML = `${data.sort.byRelevance.length} results`;
    }


  } else {
    // Show all resources
    for (const resource of resources){
      resource.classList.remove('hidden');
    }
    // Sort by Date Added
    sortResources(data.sort.byDateAdded);
    // Set active sort to Relevance
    data.sort.active = 'byDateAdded';
    document.querySelector('#sort-select option[value="byRelevance"]').hidden = true;
    document.querySelector('#sort-select option[value="byDateAdded"]').selected = true;
    // Hide search result stats
    document.querySelector('.form-group .results').hidden = true;
  }

})

// let sortSelect = document.querySelector('#sort-select');
// sortSelect.addEventListener('change', function(event){
//   let target = event.target;
//   if (target.value != data.sort.active && data.sort[target.value].length > 0){
//     sortResources(data.sort[target.value]);
//     data.sort.active = target.value;
//   }
// })