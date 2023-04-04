let updateBookmarks = function (arr){
  let bookmarkList = document.querySelector('.bookmarks-panel');
  let markup = arr.map((bookmark) => 
  `<li><a href="${bookmark.url}">${bookmark.title}</a></li>`
  ).join('');
  console.log(markup);
  bookmarkList.innerHTML = markup;
}

if (localStorage.getItem('bookmarks')){
  updateBookmarks(JSON.parse(localStorage.getItem('bookmarks')));
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

    if (target.classList.contains('bookmark-toggle')){

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
        localStorage.setItem('bookmarks', itemArr);
      }

      let setStorage = function (key, obj){
        let itemArr = [];
        itemArr.push(obj);
        itemArr = JSON.stringify(itemArr);
        localStorage.setItem(key, itemArr);
      }

      if (localStorage.getItem('bookmarks')){
        console.log('updating...');
        updateStorage('bookmarks', post);
      } else {
        console.log('creating...');
        setStorage('bookmarks', post);
      }

      target.classList.toggle('is-active');

      updateBookmarks(JSON.parse(localStorage.getItem('bookmarks')));

    }


})


