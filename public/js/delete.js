// Triggers when the delete button is pressed, utilizes the event target id to fire a fetch DELETE request to our backend's delete/:id url, passing in the event target id as a parameter.
const deleteBook = (event) => {
    fetch(`http://localhost:666/delete/${event.target.id}`, {
        method: 'DELETE',
    })
    .then(() => {
        if(window.location.pathname === '/myList') {
            window.location.href = '/myList';
        } else {
            event.target.previousElementSibling.innerHTML = "Addition undo!";
            event.target.style = "display:none";
        }
    }) // page reload to let us see the delete has happened if we are at the list page
    .catch(err => console.log(err));
}