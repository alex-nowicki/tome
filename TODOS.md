# Header

- Allow project switching from the header nav?
- Hover effect could be a white rounded rectangle?
- Phone | Switch search to button (so search bar reveals on touch)

# Home

- Reimplement with these sections:
  - Jump Back In (last three articles accessed, stored in session storage)
  - Recently Updated Articles
  - My Projects
    - Include a Card Grid and List view (default to list if there are so many projects)
    - Show all button to reveal if the list is very long

# Project

- Remove once new home is implemented

# Timeline

- Implement expand and back to top buttons
- Implement mobile responsiveness
- Figure out show lifespan form
- If show lifespan is active and you filter out category, lifespan is not hidden (2024-04-16)

# Stories

- [] Create a story layout (fence it off?), Maybe see if you can use the netlify authentication on it?

# Collections

- Collection page layout, form elements are broken
- 

# Article List

- Should it also have a jump back in section at the top? Three most recently accessed articles?

## Collections 

- Collapse all option for collections view
- Tabbing during collections view is broken (2024-04-16)


# Article Page

- Should the sidebar be recently updated articles, or accessed? If using as a wiki, recently accessed if more useful, but if you don't have that data, than recently updated fallback would make sense. Could keep as 'Recent Article' and priority is to access, but if none in that category were accessed recently, than default to most recently updated.
- Meta of published, could be swapped to Updated.
- Wiki link preview go off the page: http://localhost:3000/garuda/places/khuyens-den (2024-04-16)
- Wiki link preview z-index issue when close to a neighbouring icon, same page as above

## Breakpoint Desktop


## Breakpoint Tablet
- Second <h2> in Details pane needs to have top margin
- Possibly space to maintain recent articles sidebar?

## Breakpoint Phone
- Collapse article meta into a column (category and published date following the title)
- Timeline break into collumn (pull from programmer templates)
- Related articles should break into column and go full width
  - Could even simplify the content. Remove description?

## Other
- [] Adjust styling of lists: https://tome.nowickidesign.com/garuda/things/locknet/
- [] Tweak content spacing and add different content types for testing


# CSS
- Move media queries into nested elements, instead of at the end of the stylesheet