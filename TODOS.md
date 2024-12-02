# Header

- Allow project switching from the header nav?
- Hover effect could be a white rounded rectangle?
- Phone | Switch search to button (so search bar reveals on touch)
- When clicking away or focus away from search bar, collapse it even if it has a value

# Home

- Show All button for Projects?
- Conditional formatting depending on how many projects?
  - Initial state Large Card 1-4 on screen with a show more button. If you click the show more, the list switches to compact full width
- Compact should all be an <a>?

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

- 

## Collections 

- Collapse all option for collections view
- Tabbing during collections view is broken (2024-04-16)
- Collection page layout, form elements are broken

# Article Page

- Wiki link preview go off the page: http://localhost:3000/garuda/places/khuyens-den (2024-04-16)
- Wiki link preview z-index issue when close to a neighbouring icon, same page as above
  - Possibly implement a new version that open in a fixed dialog at the bottom of the page instead. Include description and a link to the article, X to dismiss it or click elsewhere on the page. Would be accessible on mobile devices.

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


