/*Initialize variables*/
var books = [];
var booksTable = document.getElementById("booksTable");
var bookForm = document.forms["addBookForm"];
var addBookBtn = document.getElementById("addBook");
var closeForm = document.getElementById("closeForm");
var overlay = document.getElementById("overlay");


// On load event function definition
window.onload = function(){
	try {
		if (typeof(Storage) !== "undefined") { //check if local storage is supported by the browser
		
			books = JSON.parse(localStorage.getItem("books")); //fetch books from local storage
			if(books !== null){ //if books fetched from local storage
					renderBooks(); // render books list to the books table
					
					//add form reset event making hidden parameters to default values
					bookForm.addEventListener("reset", function(){
						bookForm['book'].value = -1;
						bookForm['action'].value = 'new';
					});
			}
			else{
				books = [];
				showEmptyDataMessage(); // if books not found in local storage
			}
			
		} else {
			alert("Browser doesn't supports local storage"); // if local storage is not available
		}
	}
	catch(err) {
		alert(err);
	}
	
		/*
		 *	Add event listener to add new book button
		 *	displays add book form in popup
		*/
		addBookBtn.addEventListener('click',function(){
			bookForm.reset();
			bookForm.style.display = 'block';
			overlay.style.display = 'block';
		});
		
		/*
		 *	Add event listener to add new book button
		 *	hides add book form in popup
		*/
		closeForm.addEventListener('click',function(){
			bookForm.reset();
			bookForm.style.display = 'none';
			overlay.style.display = 'none';
		});
};



var addNewBook = function(){
	let length = bookForm.elements.length;
	let action = bookForm['action'].value;
	let book = new Book();
	for(let i = 0; i < length; i++){
		let element = bookForm.elements[i];
		var label = document.createElement("label");
		if (element.classList.contains('required') && element.value.trim() === "") {
			label.innerText  = `Please Enter ${element.name.capitalizeFirstLetter()}`;
			label.className = "errorText";
			element.nextSibling.replaceWith(label);
			return false;
		}
		else if(element.classList.contains('unique') && action === 'new' && duplicate(element.value,element.name)) {
				label.innerText  = `${element.name.capitalizeFirstLetter()} Already present`;
				label.className = "errorText";
				element.nextSibling.replaceWith(label);
				return false;
		}
		else{
			element.nextSibling.replaceWith(label);
			if(Book.getPropertiesList().indexOf(element.name) !== -1){
				book[element.name] = element.value;
			}
		}
	}
	
	var bookJson = book.toJSON();
	var index;
	if(action === 'new'){ // if new book is added
		books.push(bookJson);
		index = books.length - 1;
	}else{	//if book is updated
		index = bookForm['book'].value;
		books[index] = bookJson;
	}
	if(updateLocalStorage()){ //update local storage books 
		renderBook(bookJson,index,action);	 // render new book to the books table
		displayMessage("Book saved successfully.",'success',8000);
		bookForm.reset();	// reset form add book form
		//hides add book form in popup
		bookForm.style.display = 'none';
		overlay.style.display = 'none';
	}
	
	
	return false;
};
/**
	remove book from books array
	update local storage books
	remove book row from books table
**/
var removeBook = function(){
	if (confirm("Are you sure!!!") == true) {
		var index = this.getAttribute('data');
		books.splice(index, 1);
		
		if(updateLocalStorage()){ //update local storage books 
			booksTable.deleteRow(parseInt(index)+1);
			displayMessage("Book removed successfully.",'info',8000);
		}
		
	}
};

/*
	show add book form
	change form mode to update
	pre filled the form values
*/
var updateBook = function(){
	bookForm.style.display = 'block';
	overlay.style.display = 'block';
	var index = this.getAttribute('data');
	var book = books[index];
	Book.getPropertiesList().forEach(function(property,i){
		var element = bookForm[property];
		element.value = book[property];
	});
	bookForm['book'].value = index;
	bookForm['action'].value = 'update';
};
/*
	checks if book name is already present
*/
var duplicate = function(value,property){
	var check = false;
	books.forEach(function(book){
		if(value === book[property]){
			check = true;
			return;
		}
	});
	return check;
};

/*
	renders single book row to books table
	
*/
var renderBook = function(book,index,action){  
	if(action === "update"){
		booksTable.deleteRow(parseInt(index)+1); 
	}
	var tr = booksTable.insertRow(index + 1);
	
	var td = document.createElement('td');  
	td = tr.insertCell(0);
	td.innerText = booksTable.rows.length - 1;
	Book.getPropertiesList().forEach(function(property,i){
		td = tr.insertCell(i+1);
		td.innerText = book[property];
	}); 
	td = tr.insertCell(Book.getPropertiesList().length+1);
	var a = document.createElement('a'); 
	a.setAttribute("data",  index);
	a.setAttribute("class","btn btn-danger remove-book");
	a.innerText = "Remove";
	a.addEventListener('click', removeBook, false);
	td.appendChild(a);
	
	
	a = document.createElement('a'); 
	a.setAttribute("data",  index);
	a.setAttribute("class","btn btn-primary update-book");
	a.innerText = "Update";
	a.addEventListener('click', updateBook, false);
	td.appendChild(a);
};


var showEmptyDataMessage = function(){
	var tr = booksTable.insertRow(1);
	var td = document.createElement('td');  
	td = tr.insertCell(0);
	td.innerText = 'No records found.';
	td.setAttribute("colspan",6);
};

/*
	loop through all books and renders each book row-wise in books table
*/
var renderBooks = function(){
	if(books.length > 0){
		books.forEach(function(book,index){
			renderBook(book,index,'new');
		});
	}
	else{
		showEmptyDataMessage();
	}
	
};