document.addEventListener('click', function(event){

    let target = event.target;
    
    if (target.classList.contains('accordion-toggle')){

    let accordion = event.target.closest('.accordion');

    // Check if the current toggle is expanded.
    let isExpanded = target.getAttribute('aria-expanded') == 'true';
    let active = accordion.querySelector('[aria-expanded="true"]');

    // Close the open accordion if not active
    if (active && active !== target) {
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

    event.preventDefault();
    
    }
})