export const toTitleCase = function(str){
    let sentence = str.toLowerCase().split(' ');
      for(let i = 0; i < sentence.length; i++){
         sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
      }
   sentence = sentence.join(" ");
   return sentence;
}

export const detectType = function(elem){
   let type;
   if (Array.isArray(elem)){
       type = 'array';
   } else if (typeof elem === 'object' && elem !== null){
       type = 'object';
   } else {
       type  = typeof elem;
   }
   return type;
}

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short' 
});

/**
* Get the post's corresponding category icon and singular label
* @param  {String} category the post category
* @return {Object} updated post with new values
*/
export const getCatIconAndLabel = function (category) {
    let svgs = {
        people: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <circle vector-effect="non-scaling-stroke" cx="12" cy="5.5" r="4.5"/>
                    <path vector-effect="non-scaling-stroke" d="m2 22.18 2.32-6.95c.41-1.23 1.55-2.05 2.85-2.05h9.68c1.29 0 2.44.83 2.85 2.05l2.32 6.95"/>
                </svg>`,
        groups: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <circle vector-effect="non-scaling-stroke" cx="15.08" cy="15.08" r="7.92"/>
                    <circle vector-effect="non-scaling-stroke" cx="8.92" cy="8.92" r="7.92"/>
                </svg>`,
        places: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path vector-effect="non-scaling-stroke" d="M11.93 5.86h.01c1.78 0 3.23 1.45 3.24 3.24 0 1.79-1.44 3.25-3.23 3.25h-.03c-1.78 0-3.23-1.46-3.23-3.25s1.45-3.24 3.24-3.24Z"/>
                    <path vector-effect="non-scaling-stroke" d="M12 1c4.5 0 8.15 3.69 8.15 8.23 0 1.97-.29 3.33-1.39 5.12-.83 1.35-4.24 5.96-5.88 8.16-.44.59-1.32.59-1.76 0-1.63-2.2-5.05-6.81-5.88-8.16-1.11-1.79-1.4-3.15-1.39-5.12C3.85 4.69 7.5 1 12 1Z"/>
                </svg>`,
        events: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <circle vector-effect="non-scaling-stroke" cx="12" cy="12" r="11"/>
                    <path vector-effect="non-scaling-stroke" d="M11.5 12.5V5M11.5 12.5h6"/>
                </svg>`,
        things: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path vector-effect="non-scaling-stroke" d="m1.5 5.63 10.5 4.7M12 1 1.5 5.63v12.74L12 23l10.5-4.63V5.63L12 1zM22.5 5.63 12 10.33M12 10.33V23"/>
                </svg>`,
        projects:   `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path vector-effect="non-scaling-stroke" d="M17 23V2"/>
                        <path vector-effect="non-scaling-stroke" d="M5.5 2H4c-.55 0-1 .45-1 1v19c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1h-7.5"/>
                        <path vector-effect="non-scaling-stroke" d="M6.81 10.79 8.89 9.4c.07-.04.15-.04.22 0l2.08 1.39c.13.09.31 0 .31-.17V1.2c0-.11-.09-.2-.2-.2H6.7c-.11 0-.2.09-.2.2v9.43c0 .16.18.26.31.17Z"/>
                    </svg>`,
        bookmarks:  `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path vector-effect="non-scaling-stroke" d="m4.84 22.61 6.82-6.3c.19-.18.49-.18.68 0l6.82 6.3c.32.3.84.07.84-.37V1.5c0-.28-.22-.5-.5-.5h-15c-.28 0-.5.22-.5.5v20.75c0 .44.52.66.84.37Z"/> 
                    </svg>`
    }
    let icon;
    let label;
    if (category === 'People') {
        icon = svgs.people;
        label = 'Person';
    } else if (category === 'Groups') {
        icon = svgs.groups;
        label = 'Group';
    } else if (category === 'Places') {
        icon = svgs.places;
        label = 'Place';
    } else if (category === 'Events') {
        icon = svgs.events;
        label = 'Event';
    } else if (category === 'Things') {
        icon = svgs.things;
        label = 'Thing';
    } else {
        icon = svgs.projects;
        label = 'Project';
    }

    return {
        icon: icon,
        label: label
    }

}

export const processEventsForTimeline = function(frontmatter) {

    let events = frontmatter.events;
        
    // Check if the post has an events array, if not create one
    if (!events) { events = [] }

    if (frontmatter.category === 'Events'){

        let eventStart = {};

        if (frontmatter.description !== undefined) { eventStart.description = frontmatter.description };

        // If both start date and end date are desribed
        if (frontmatter.details.startDate && frontmatter.details.endDate){

            eventStart.title = `${frontmatter.title} (Start)`;
            eventStart.date = frontmatter.details.startDate;

        // Else if only the start date is described
        } else if (frontmatter.details.startDate) {

            eventStart.title = frontmatter.title;
            eventStart.date = frontmatter.details.startDate;

        // Otherwise set the date to unknown
        } else {

            eventStart.title = frontmatter.title;
            eventStart.date = { 
                full: 'Unknown',
                year: Number.NEGATIVE_INFINITY
            };

        }

        events.push(eventStart);
        // console.log(events);

        // If an end date is described
        if (frontmatter.details.endDate){
            events.push({
                title: `${frontmatter.title} (End)`,
                description: frontmatter.description !== undefined ? frontmatter.description : null,
                date: frontmatter.details.endDate
            })
        }

    }

    events.map((event) => {

        event.postCategory = frontmatter.category;
        event.postTitle = frontmatter.title;

    })

    

    // console.log(events);

    return events;

}