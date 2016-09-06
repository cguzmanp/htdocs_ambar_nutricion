function giveStyle(){
	especifyButtons()
	
}

function especifyButtons() {
	document.getElementById('submit').addEventListener('click',function() {
		// Get the value from the editor
		console.log(editor.getValue());
	});
	
	document.getElementById('especifSi').addEventListener('click',function() {
		// Get the value from the editor
		console.log("Sí");
		document.getElementById('especifSi').disabled = true;
		document.getElementById('especifNo').disabled = false;
		document.getElementById('editor_holder').hidden = false;
	});
	
	document.getElementById('especifNo').addEventListener('click',function() {
		// Get the value from the editor
		console.log("No");
		document.getElementById('especifNo').disabled = true;
		document.getElementById('especifSi').disabled = false;
		document.getElementById('editor_holder').hidden = true;
	});
}