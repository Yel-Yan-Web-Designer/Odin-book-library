const addBtn = document.querySelector(".add-btn"),
      modal = document.querySelector(".modal"),
      form = document.querySelector(".form"),
      bookContainer = document.querySelector(".book-container"),
      warning = document.querySelector(".alert");

/*
! add modal Box
*/
addBtn.addEventListener("click" , () => {
    modal.classList.remove("hidden")
})


/*
! remove modal when click outside
 */
document.addEventListener("click" , (e) => {
    const selectedElement = e.target;

    if(selectedElement.classList.contains("modal")){
        modal.classList.add("hidden")
    }
})


/*
! Data Structure
*/
class Book {
    constructor(
        id,
        title,
        author,
        pages,
        isRead
    ){
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

let data = JSON.parse(localStorage.getItem("book")) || [];

class Library {
    // create or add book
    addBook (newBook) {
        return data.push(newBook);
    }
    // remove book
    removeBook (selectedBookId) { 
        return data = data.filter(x => x.id  !== selectedBookId);
    }

    // check book is already exist or not
    checkBook (title) {
        // "some" function will stop finding match and return true if it find the same title name
        return data.some(x => x.title === title)
    }

}
// create instance object using Library class
let lib = new Library();


/**
 * ! Form submit
 */
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let titleValue = document.querySelector("#title").value.trim(); // remove leading/trailing spaces
    let authorValue = document.querySelector("#author").value;
    let pagesValue = document.querySelector("#pages").value;
    let readValue = document.querySelector("#checkbox").checked;
    // create unique Id
    let id = "id" + Math.random().toString(10).slice(2);

    if(titleValue === ""){
        return; // don't proceed if input is empty
    }
    
    // check title is already existed or not
    const existedTitle = lib.checkBook(titleValue);

    if(existedTitle){
        warning.classList.remove("hidden");
        // do not let modal hide
        modal.classList.remove("hidden");
    } else {
        warning.classList.add("hidden");
        // add book to library
        addBookToLibrary(id , titleValue, authorValue , pagesValue , readValue);
        // display on UI
        generateBookCard();
        // remove modal 
        modal.classList.add("hidden");
    }


    // reset input value
    document.querySelector("#title").value = "";
    document.querySelector("#author").value= "";
    document.querySelector("#pages").value = "";
    document.querySelector("#checkbox").checked = false;
})


/*
 ! Add new book to library
*/
function addBookToLibrary (id , titleValue, authorValue , pagesValue , readValue) {
    let newBook = new Book( id , titleValue, authorValue , pagesValue , readValue);
    lib.addBook(newBook);

    // save to localstorage
    localStorage.setItem("book" , JSON.stringify(data))
}

/*
 ! Read btn with textContent and btn color change
*/
function readBtnOperation (id){
    const selectedReadBtn = id.id;
    //choose selected btn with id
    const btn = document.querySelector(`#${selectedReadBtn}`);
    
    if(!btn.classList.contains("unread-btn")){
        btn.classList.add("unread-btn");
        btn.textContent = "Not Read";
        saveInLocal();
    } else {
        btn.classList.remove("unread-btn");
        btn.textContent = "Read";
        saveInLocal();
    }

    function saveInLocal () {
        let isReadChange = data.findIndex(x => x.id === selectedReadBtn);
        data[isReadChange].isRead = !data[isReadChange].isRead;

        localStorage.setItem("book" , JSON.stringify(data))
    }
}   

/*
 ! Remove selected book card 
*/
function removeBookCard (id) {
    const selectedBookId = id.id;
    lib.removeBook(selectedBookId);

    // display ui
    generateBookCard();

    // save to localstorage , reset local storage after updating data
    localStorage.setItem("book" , JSON.stringify(data))
}


/*
 ! Generate book card
*/
function generateBookCard () {

    if(data.length == 0){
        bookContainer.innerHTML = `
            <div>There are no book yet! Add a new book</div>
        `
    } else {
        // display on UI
        bookContainer.innerHTML = data.map(({id , title, author, pages, isRead}) => {
            return (`
            <div class="book" id="book-${id}">
                <div class="book-items">
                    <h3>Title -</h3>
                    <p>${title}</p>
                </div>
                <div class="book-items">
                    <h3>Author -</h3>
                    <p>${author}</p>
                </div>
                <div class="book-items">
                    <h3>Pages -</h3>
                    <p>${pages}</p>
                </div>
                <button id="${id}" class="${isRead ? "read-btn" : "unread-btn read-btn"}" onclick="readBtnOperation(${id})">${isRead ? "Read" : "Not Read"}</button>
                <button id="${author.substring(0, 2)}"  class="remove-btn" onclick="removeBookCard(${id})">Remove</button>
            </div>`)
        }).join(" ");
    }
}
generateBookCard();

/*
 ! Remove all books from library & localstorage
*/
function clearLibrary(){
    data = [];
    generateBookCard();
    localStorage.setItem("book" , JSON.stringify(data));
}