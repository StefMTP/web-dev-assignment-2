const filterBooks = (event) => {
    event.preventDefault();
    const search = event.target.firstElementChild.value;

        fetch(`http://localhost:666/filter?search=${search}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => res.json()).then(books => {
            console.log(books);
            list.innerHTML = '';
            books.forEach(book => {
                list.innerHTML += `
                <li class="book-card">
                    <h3>\"${book.title}\", written by ${book.author}</h3>
                    <div>${book.review ? 'My review: ' + book.review : ''}</div>
                    <div id="btn-group">
                        <a class="btn" href="/edit/${book.workid}">Edit</a>
                        <a class="btn" href="#" id="${book.workid}" onclick="deleteBook(event)">Delete</a>
                    </div>
                </li>
                `
            })
        });

}

const list = document.getElementById('book-list');