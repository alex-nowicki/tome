
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