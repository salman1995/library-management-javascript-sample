/*Initialize variables*/
var books = [],publishers = [];
var publishersTable = document.getElementById("publishersTable");

// On load event function definition
window.onload = function(){
	try {
		if (typeof(Storage) !== "undefined") {
			books = JSON.parse(localStorage.getItem("books"));
			if(books !== null){
					publishers = books.map(function(book){
						return {
							publisherName : book.publisherName,
							booksCount: books.filter(function(book2){
								return book2.publisherName === book.publisherName;
							}).length
						};
					}).filter(function(e,i,a){
						return i === a.findIndex(e1 => e1.publisherName === e.publisherName);
					});
					renderPublishers();
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

var removePublisher = function(){
	if (confirm("Are you sure!!!") == true) {
		var name = this.getAttribute('name');
		var index = this.getAttribute('index');
		books = books.filter(function(book){
					return book.publisherName !== name;
				});
		
		
		if(updateLocalStorage()){
			publishersTable.deleteRow(parseInt(index)+1);
			displayMessage("Publisher and its books removed successfully.",'info',8000);
		}

	}
};
var renderPublisher = function(publisher,index){
	var tr = publishersTable.insertRow(index + 1);
	
	var td = document.createElement('td');  
	td = tr.insertCell(0);
	td.innerText = publishersTable.rows.length - 1;
	
	td = tr.insertCell(1);
	td.innerText = publisher.publisherName;
	
	td = tr.insertCell(2);
	td.innerText = publisher.booksCount;
	
	td = tr.insertCell(3);
	var a = document.createElement('a'); 
	a.setAttribute("name",  publisher.publisherName);
	a.setAttribute("index",  index);
	a.setAttribute("class","btn btn-danger");
	a.innerText = "Remove";
	a.addEventListener('click', removePublisher, false);
	td.appendChild(a);
	
	
};
var showEmptyDataMessage = function(){
	var tr = publishersTable.insertRow(1);
	var td = document.createElement('td');  
	td = tr.insertCell(0);
	td.innerText = 'No records found.';
	td.setAttribute("colspan",4);
};
var renderPublishers = function(){
	
	if(publishers.length > 0){
		publishers.forEach(function(publisher,index){
			renderPublisher(publisher,index);
		});
	}
	else{
		showEmptyDataMessage();
	}
};