# Header

- Allow project switching from the header nav?
- Hover effect could be a white rounded rectangle?
- Phone | Switch search to button (so search bar reveals on touch)
- When clicking away or focus away from search bar, collapse it even if it has a value

# Home

- Reimplement with these sections:
  - My Projects
    - Include a Card Grid and List view (default to list if there are so many projects) - Opted for compact card instead
    - For project list, large card for the two most recently accessed/updated projects, compact for the rest. (if doing the 2/3 column, to 1/3 column layout)
    - Recent articles could use a project tag to show which one they are associated with.

# Project

- Remove once new home is implemented

# Timeline

- Implement expand and back to top buttons
- Implement mobile responsiveness
- LIFESPAN FUNCTIONALITY
  - Show counter of how many you can have active at once (0/3)
  - Fix Show more button style (icon?)
  - if button is active and you deselect while search is enabled, it doesn't dissapear (maybe not a bad thing?)
  - If show lifespan is active and you filter out category, lifespan is not hidden (2024-04-16)

# Stories

- [] Create a story layout (fence it off?), Maybe see if you can use the netlify authentication on it?

# Article List

- Should the category article links, be replaced with just a single hyperlink to the category?

## Collections 

- Collapse all option for collections view
- Tabbing during collections view is broken (2024-04-16)
- Collection page layout, form elements are broken

# Article Page

- Meta of published, could be swapped to Updated. Possibly even published (original) and updated for most recent update.
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


