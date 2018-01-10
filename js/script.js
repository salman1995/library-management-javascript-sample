var messages = document.getElementById('messages');

class Book{
	constructor(){
		this._name = "";
		this._authorName = "";
		this._publisherName = "";
		this._publishDate = "";
	}
	
	get name(){
		return this._name;
	}
	
	get authorName(){
		return this._authorName;
	}
	
	get publisherName(){
		return this._publisherName;
	}
	
	get publishDate(){
		return this._publishDate;
	}
	
	set name(name){
		 this._name = name;
	}
	
	set authorName(authorName){
		 this._authorName = authorName;
	}
	
	set publisherName(publisherName){
		 this._publisherName = publisherName;
	}
	
	set publishDate(publishDate){
		 this._publishDate = publishDate;
	}
	
	static getPropertiesList(){
		return ["name","authorName","publisherName","publishDate"];
	}
	toJSON() {
		return {
		  name: this._name,
		  authorName: this._authorName,
		  publisherName: this._publisherName,
		  publishDate: this._publishDate
		}
    }

}


function updateLocalStorage(){
	try{
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("books",JSON.stringify(books));
			return true;
		} else {
			alert("Browser doesn't supports local storage");
		}
		
	}catch(err) {
		books = [];
		alert(err);
	}
	return false;
	
}
var displayMessage = function(message,type,time){
	messages.innerText = message;
	messages.setAttribute("class",type);
	messages.style.display='block';
	setTimeout(function () {
		messages.innerText = "";
        messages.style.display='none';
    }, time);
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
