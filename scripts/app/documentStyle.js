function giveStyle(){
	especifyButtons();
	changeTitles();
	addFormClassToSelect();
	loadOneElementByCategory();
	deleteType();
	repairSelect();
	selectChanges();
	tableWidth();
}

function deleteType() {
	$("div[data-schemapath*='Id_tipo']").remove();
	$("select[name*='Id_tipo'] :nth-child(1)").prop('selected', true);
	$("div[data-schemapath*='fecha_comida']").parent().remove();
	$("div[data-schemapath*='horario_comida']").parent().remove();
	$("div[data-schemapath*='no_especificar']").parent().remove();
	$("div[data-schemapath*='hospitalizacion_id']").parent().remove();
	$("div[data-schemapath*='clave_corta']").parent().remove();
}

function especifyButtons() {
	$("#especifSi").on('click', function() {
		console.log("Sí");
		$('#especifSi').prop("disabled", true);
		$('#especifNo').prop("disabled", false);
		$('#editor_holder').prop("hidden", false);
	});
	
	$("#especifNo").on('click', function() {
		console.log("No");
		$('#especifSi').prop("disabled", false);
		$('#especifNo').prop("disabled", true);
		$('#editor_holder').prop("hidden", true);
	});
}

function changeTitles() {
	$('h3').each(function() {
		$(this).replaceWith($('<label>' + this.innerHTML + '</label>'));
	});
}

function addFormClassToSelect() {
	$(".json-editor-btn-add").on('click', function() {
		deleteType();
		$("* select").addClass("form-control");
		$("* input").addClass("form-control");
		$("h3").remove();
		
		$("button.json-editor-btn-delete").on("click", function() {
			deleteType();
			$(".row").removeClass('row');
			$("table .well").removeClass("well").removeClass("well-sm");
			addColClasses();
		});
		
		var $table = $(event.target).parent().parent();
		
		$table.find("tr:last td:first").prepend( "<div class='col-xs-4'><div class='form-group'></div></div>" );
		$table.find("tr:last label:first").text("Comida").addClass("control-label").appendTo( $table.find("tr:last .form-group:first") );
		$table.find("tr:last select:first").removeAttr("style").appendTo( $table.find("tr:last .form-group:first") );
		$table.find('.row').removeClass('row');
		$table.find('table .well.well-sm').removeClass('well').removeClass('well-sm');
		
		$("select option[value=undefined]").remove();
		
		$("div.col-md-12").each( function(){
			$(this).find("tbody tr:not(:first) label").remove();
		});
		selectChanges();
		addColClasses();
	});
}

function selectChanges() {
	$("select").on("change", function() {
		deleteType();
		$("* select").addClass("form-control");
		$("* input").addClass("form-control");
		$("h3").remove();
		$("div.col-md-12 .row").removeClass("row");
		$("table .well").removeClass("well").removeClass("well-sm");
		$("select option[value=undefined]").remove();
		$("div.col-md-12").each( function(){
			$(this).find("tbody tr:not(:first) label").remove();
		});
		addColClasses();
	});
}

function repairSelect() {
	$(".row").css("max-width", "none");
	$("th").remove();
}

function loadOneElementByCategory() {
	$(".json-editor-btn-add:contains('+')").click();
	$("button.delete[data-i='0']").prop("disabled", true);
	$("h3").remove();
	$("div.col-md-12").each( function(){
		$(this).find("tr:last td:first").prepend( "<div class='col-xs-4'><div class='form-group'></div></div>" );
		$(this).find("tr:last label:first").text("Comida").addClass("control-label").appendTo( $(this).find("tr:last .form-group:first") );
		$(this).find("tr:last select:first").removeAttr("style").appendTo( $(this).find("tr:last .form-group:first") );
		$(this).find('.row').removeClass('row');
		$(this).find('table .well.well-sm').removeClass('well').removeClass('well-sm');
	});
	$("select option[value=undefined]").remove();
	addColClasses();
}

function tableWidth() {
	$(".table.table-bordered").css("width", "");
	$(".well:first").removeClass("well-sm").removeClass("well");
	$("div label:first").remove();
}

function addColClasses() {
	$("div[data-schemapath*='Id_opcion']").removeClass().addClass("col-xs-3");
	$("div[data-schemapath*='Porcion']").removeClass().addClass("col-xs-2");
	$("div[data-schemapath*='Especificar']").removeClass().addClass("col-xs-3");
}