function giveStyle(){
	especifyButtons();
	changeTitles();
	addFormClassToSelect();
	fixSelect();
	oneElement();
	getTypesInside();
}

function especifyButtons() {
	document.getElementById('submit').addEventListener('click',function() {
		console.log(editor.getValue());
	});
	
	document.getElementById('especifSi').addEventListener('click',function() {
		console.log("Sí");
		document.getElementById('especifSi').disabled = true;
		document.getElementById('especifNo').disabled = false;
		document.getElementById('editor_holder').hidden = false;
		document.getElementById('submit').hidden = false;
	});
	
	document.getElementById('especifNo').addEventListener('click',function() {
		console.log("No");
		document.getElementById('especifNo').disabled = true;
		document.getElementById('especifSi').disabled = false;
		document.getElementById('editor_holder').hidden = true;
		document.getElementById('submit').hidden = true;
	});
}

function changeTitles() {
	$('h3').each(function() {
		$(this).replaceWith($('<label>' + this.innerHTML + '</label>'));
	});
}

function addFormClassToSelect() {
	$(".json-editor-btn-add").on('click', function() {
		console.log( "HEY!!" );
		$("* select").addClass("form-control");
		$("* input").addClass("form-control");
		
		$("select").on("change", function() {
			console.log( "HEY!!" );
			$("* select").addClass("form-control");
			$("* input").addClass("form-control");			
		});
	});
}

function fixSelect() {
	$(".row").css("max-width", "none");
	$("th").remove();
	
}

function oneElement() {
	$(".json-editor-btn-add:contains('+')").click();
	$("button.delete[data-i='0']").prop("disabled", true);
	$("h3").remove();
	$("div.col-md-12").each( function(){
		$(this).find("label")[1].remove();
	});
}

function getTypesInside() {
	// $(".row:has(.row)").each( function() { $(this).find("label")[0].css("color","red") } );
}



