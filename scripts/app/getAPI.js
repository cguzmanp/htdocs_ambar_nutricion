function getAPI(uri, process) {
	console.log(base_url + uri);
	$.ajax({
		headers : {
			Accept : "application/json",
			"Content-Type" : "application/json"
		},
		url : base_url + uri,
		dataType : 'json',
	}).done(process);
}

function getAPIXHR() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://localhost:8080/AmbarNutricion/unidades");
	//xhr.setRequestHeader("Origin", "http://localhost:8080/AmbarNutricion");
	
	xhr.onload = function () {
		console.log(xhr.responseText);
	}
	xhr.send();
}