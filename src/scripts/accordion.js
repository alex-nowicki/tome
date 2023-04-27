//
// Methods
//

/**
 * Show content on click events
 * @param  {Event} event The event object
 */
let accordionClickHandler = function(event) {

        // Only run on accordion buttons
        if (!event.target.matches('.accordion-toggle')) return;

        event.preventDefault();

        // Toggle accordion visibility
        toggleAccordion(event.target);

}

/**
 * Toggle accordion visibility
 * @param  {Node} targetAccordion The accordion to show
 */
let toggleAccordion = function(targetAccordion) {

    // Get the accordion group
    let accordionGroup = targetAccordion.closest('.accordion');
    
    // Check whether the accordion group allows multiple open panels
    let allowMultiple = accordionGroup.hasAttribute('data-allow-multiple');

    // Check if the current panel is expanded
    let isExpanded = targetAccordion.getAttribute('aria-expanded') == 'true';
    
    // Get the active toggle
    let active = accordionGroup.querySelector('[aria-expanded="true"]');

    // If the target is not active, and allow multiple is false, close the open accordion if not active
    if (!allowMultiple && active && active !== targetAccordion) {

        // Reset the active toggle
        active.setAttribute('aria-expanded', 'false');
        
        // Hide the accordion panel, using aria-controls to specify the desired section
        document.querySelector(`#${active.getAttribute('aria-controls')}`).setAttribute('hidden', '');

    }

    // If the target is closed, open the accordion
    if (!isExpanded) {

        // Set the expanded state on the triggering element
        targetAccordion.setAttribute('aria-expanded', 'true');

        // Hide the accordion sections, using aria-controls to specify the desired section
        document.querySelector(`#${targetAccordion.getAttribute('aria-controls')}`).removeAttribute('hidden');
    }

    // If the target is open, close the accordion
    else if (isExpanded) {

        // Set the expanded state on the triggering element
        targetAccordion.setAttribute('aria-expanded', 'false');

        // Hide the accordion sections, using aria-controls to specify the desired section
        document.querySelector(`#${targetAccordion.getAttribute('aria-controls')}`).setAttribute('hidden', '');
    }

}


//
// Inits & Event Listeners
//

document.addEventListener('click', accordionClickHandler);