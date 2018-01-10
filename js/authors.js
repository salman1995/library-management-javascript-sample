/*Initialize variables*/
var books = [],authors = [];
var authorsTable = document.getElementById("authorsTable");

// On load event function definition
window.onload = function(){
	try {
		if (typeof(Storage) !== "undefined") {
			books = JSON.parse(localStorage.getItem("books"));
			if(books !== null){
					authors = books.map(function(book){
						return {
							authorName : book.authorName,
							booksCount: books.filter(function(book2){
								return book2.authorName === book.authorName;
							}).length
						};
					}).filter(function(e,i,a){
						return i === a.findIndex(e1 => e1.authorName === e.authorName);
					});
					renderAuthors();
			}
			else{
				books = [];
				showEmptyDataMessage();
			}
			
		} else {
			alert("Browser doesn't supports local storage");
		}
	}catch(err) {
		alert(err);
	}
};

var removeAuthor = function(){
	if (confirm("Are you sure!!!") == true) {
		var name = this.getAttribute('name');
		var index = this.getAttribute('index');
		books = books.filter(function(book){
					return book.authorName !== name;
				});
		if(updateLocalStorage()){
			authorsTable.deleteRow(parseInt(index)+1);
			displayMessage("Author and its books removed successfully.",'info',8000);
		}
	}
	
};
var renderAuthor = function(author,index){
	var tr = authorsTable.insertRow(index + 1);
	
	var td = document.createElement('td');  
	td = tr.insertCell(0);
	td.innerText = authorsTable.rows.length - 1;
	
	td = tr.insertCell(1);
	td.innerText = author.authorName;
	
	td = tr.insertCell(2);
	td.innerText = author.booksCount;
	
	td = tr.insertCell(3);
	var a = document.createElement('a'); 
	a.setAttribute("name",  author.authorName);
	a.setAttribute("index",  index);
	a.setAttribute("class","btn btn-danger");
	a.innerText = "Remove";
	a.addEventListener('click', removeAuthor, false);
	td.appendChild(a);
	
	
};
var showEmptyDataMessage = function(){
	var tr = authorsTable.insertRow(1);
	var td = document.createElement('td');  
	td = tr.insertCell(0);
	td.innerText = 'No records found.';
	td.setAttribute("colspan",4);
};
var renderAuthors = function(){
	if(authors.length > 0){
		authors.forEach(function(author,index){
			renderAuthor(author,index);
		});
	}
	else{
		showEmptyDataMessage();
	}
};