// searchWorks triggers whenever the search button is pushed. It fires a fetch GET request to the random house API, on the works endpoint, using the value of the 'search-term' input as a search query, and a max query set to 0 in order to return all results to the page. If nothing is returned, it alters the HTML of the page accordingly, to notify the user that nothing was found. If it finds any results, then they are brought in the page by DOM manipulation, using the method structList. There are two chances: if the results are multiple, then 'work' will be an array. If it is only one, it will be brought in as an object.
const searchWorks = (event) => {
    event.preventDefault();
    works.innerHTML = '<p class="message">Loading results, please wait...</p>';
    const search_term = document.getElementById("search-term").value;
    fetch(`https://reststop.randomhouse.com/resources/works?search="${search_term}"&max=0`, { 
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.json()).then(data => {
        if(!data.work) {
            works.innerHTML = "";
            if(!search_term) {
                count.innerHTML = '<h4 class="message">Make sure to enter a search term first!</h4>';
                return;
            }
            count.innerHTML = `<h4 class="message">Could not find results for ${search_term}. Please choose another search term!</h4>`;
            return;
        }
        works.innerHTML = "";
        
        if(Array.isArray(data.work)){
            count.innerHTML = `<h4>${data.work.length} results found</h4>`;
            data.work.forEach((work, index) => structList(work, index));
        } else {
            count.innerHTML = `<h4>1 result found</h4>`;
            structList(data.work);
        }
    });
}

const structList = (work, index=0) => {
    works.innerHTML += `<li id="list-item-${index}" class="book-card">
                            <h3>${work.titleweb}</h3>
                            <p>WRITTEN BY: ${work.authorweb}</p>
                            <button 
                            data-id="${work.workid}" 
                            data-title="${work.titleweb}" 
                            data-author="${work.authorweb}"
                            class="btn"
                            onclick=addBook(event)>
                                Add
                            </button>
                            <div></div>
                            <button
                            id="${work.workid}"
                            class="btn"
                            style="display:none" 
                            onclick=deleteBook(event)>
                                Undo
                            </button>
                        </li>`;
}

// Triggers when the Add Book button is clicked on a book list item, utilizing the data- attributes of the event target. Fires a fetch POST request to our backend on the /add endpoint which will request to add a book in the database.
const addBook = async (event) => {
    [id, title, author] = event.target.attributes;
    // post request to add a book into our list and DB
    fetch('http://localhost:666/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            workid: id.value,
            title: title.value,
            author: author.value
        })
    }).then(res => res.json())
    .then(data => {
       event.target.nextElementSibling.innerHTML = data.message;
       if(data.added){
           event.target.parentElement.lastElementChild.style = "display:inline-block";
        } else {
            event.target.parentElement.lastElementChild.style = "display:none";
       }
    });
}

const count = document.getElementById("count");
const works = document.getElementById("works");
const btn = document.getElementById("search").addEventListener('submit', searchWorks);