//
// Variables
//





//
// Methods
//

/**
 * Get bookmarks from localstorage and update sidepanel
 * @param {Array} arr - List of bookmarks
 */
let updateBookmarks = function (arr){
  let bookmarkList = document.querySelector('.bookmarks-panel');
  let markup = arr.map((bookmark) => 
  `<li>
    <a href="${bookmark.url}">${bookmark.title}</a>
    <button class="bookmark-toggle is-active">
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path vector-effect="non-scaling-stroke" d="m4.84 22.61 6.82-6.3c.19-.18.49-.18.68 0l6.82 6.3c.32.3.84.07.84-.37V1.5c0-.28-.22-.5-.5-.5h-15c-.28 0-.5.22-.5.5v20.75c0 .44.52.66.84.37Z"/> 
      </svg>
    </button>
  </li>`
  ).join('');
  bookmarkList.innerHTML = markup;

  let treeLinks = document.querySelectorAll('.tree .accordion-panel li');
  for (const link of treeLinks){
    for (const bookmark of arr) {
      if (link.querySelector('a').pathname == bookmark.url){
        link.querySelector('button').classList.add('is-active');
      }
    }
  }
}



//
// Inits & Event Listeners
//

if (document.querySelector('sidepanel') && localStorage.getItem('bookmarks')){
  let bookmarkList = document.querySelector('.sidepanel .bookmarks-panel');
  updateBookmarks(JSON.parse(localStorage.getItem('bookmarks')));
}

//
// Exports
//








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





