Scraping system

ok so i want to build a general mobile web scraper.

Material 3 expressive style
Express.js backend
Vue.js for frontend
code to be highly cohesive and loosely coupled
use the latest ecmascript features i dont care about legacy browsers
comnent all code in a way that explains what and why

Flow:
User inputs a url and the presses load.
The web page loads in a frame with a toolbar above it.
User presses on a "select items" button.
The user then selects a div inside the page loaded in the frame.
The div is highlighted and all of its sibling elements with a badge to show what number item it would be.
There is a "foreach items" button that is added and selected to show the user they are in the "foreach" mode.
The user now can start on the "foreach" phase by pressing on a button in the toolbar.
The foreach mode has a toolbar that appears below the main toolbar.
the user can press on a "Add Property" button where then the user selects an element inside the item div.
When hovering over an item or tapping it inside the item div during the Add Property action each other item div has the same element highlighted as well.
After the user taps on a child element inside the item div little popup shows asking for the items property name and showing the div that has been selected and asking the user to confirm the property.
the user can also press a "Add Link" button and then press on a link inside the item.
The same highlighting for sibling items happens when hovering or tapping on a link
after tapping a link a little popup shows asking the user to name the link and confirm it.
When the user confirms it the link is then loaded inside the frame and a little back button is added to the foreach toolbar
the user can then press add property button then select any item inside the linked page that is loaded.
The user then has to name and confirm the added properties name.
The user can also press a "Add Image" button in the foreach toolbar and then select an image in the item div or in a linked page of the item.
they then give the image a name and confirm it.
Once the user has added all the items properties and links they can then press a "select next" button in the main toolbar.
After they hit "select next" they can select a link on the loaded page in the frame to advance to the next page.
the next page is loaded in the frame and a target button is added next to the select next button.
If they hover or tap on the foreach mode all of the items matching the item selector and its sibilings are highlighted with badge numbers showing the item number.
if the user presses on the target button that was added after they had selected what the next page link is then the next page link is highlighted in the page loaded on the frame.
Once the user has set up the item selector with at least one foreach property they can press a "start" button to scrape the items on the page and start to build a json file with a list of the scraped items and each items property and any links the item may have which the scrapper will load and put any properties or images for the items link inside the link as properties on an object.
if there is no next button selected ask the user if they want to add one before the scrapping begins.
after all items have been scrapped from a page the scrapper then loads the next page until it cant find any more pages next.
The user can then view the items in the json file with the ability to filter for different properties by adding different rules saying if a property contains or doesn't contain a specified term
the json files along with there scrapping details are saved so later on the user can rerun a scrapping to either add more items and update the current items or to completely replace the items
