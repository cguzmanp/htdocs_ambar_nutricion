function selectOption(id, option) {
	if (option) {
		$(id + ' option[value="' + option + '"]').prop('selected', true)
		$(id).change();
	}
}

function getFormulas(selectedFormula) {
	process = function(response) {
		var select = $('#formula');
		select.find('option').remove();
		select.change();

		select.append('<option value="">Seleccione opción</option>');
		for (var i = 0; i < response.length; i++) {
			if (response[i].valid) {
				select.append('<option value="' + response[i].id + '">'
						+ response[i].nombre + '</option>');
			}
		}
		selectOption('#formula', selectedFormula);
	}
	getAPI('/formulas', process);
}

function getDilucion(selectedDilusion) {
	var select = $('#dilusion');
	select.find('option').remove();
	select.change();

	select.append('<option value="">Seleccione opción</option>');
	for (var i = 0.5; i <= 22.5; i = i + 0.5) {
		select.append('<option value="' + (1.0 * i / 100) + '">' + i
				+ '%</option>');
	}
	selectOption('#dilusion', selectedDilusion);
}

function getVolumen(selectedVolumen) {
	var select = $('#volumen');
	select.find('option').remove();
	select.change();

	select.append('<option value="">Seleccione opción</option>');
	for (var i = 10; i <= 500; i = i + 5) {
		select.append('<option value="' + i + '">' + i + '</option>');
	}

	selectOption('#volumen', selectedVolumen);
}

function getFrecuencia(selectedFecuencia) {
	process = function(response) {
		var select = $('#frecuencia');
		select.find('option').remove();
		select.change();
		select.append('<option value="">Seleccione opción</option>');
		for (var i = 0; i < response.length; i++) {
			frecuencias[response[i].id] = response[i];
			select.append('<option value="' + response[i].id + '">'
					+ response[i].frecuencia + '</option>');
		}
		selectOption('#frecuencia', selectedFecuencia);
	}
	getAPI('/horarios', process);
}

function setHorario(idHorario) {
	if (frecuencias.hasOwnProperty(idHorario)) {
		$('#horario').val(frecuencias[idHorario].horario);
	}
}

function getCategoriaSuplementos(selectedSuplementosParam) {

	for (var i = 0; i < selectedSuplementosParam.length; i++) {
		var suplemento = selectedSuplementosParam[i];
		if (suplemento.hasOwnProperty('tipoSuplemento')
				&& suplemento.tipoSuplemento
				&& suplemento.tipoSuplemento.hasOwnProperty('categoria')
				&& suplemento.tipoSuplemento.categoria) {
			selectedSuplementosObject[suplemento.tipoSuplemento.categoria.id] = suplemento;
		}
	}
	process = function(response) {
		var div = $('#categorias');
		categiaSuplementos = response;
		for (var i = 0; i < categiaSuplementos.length; i++) {
			var categoria = categiaSuplementos[i];
			for (var j = 0; j < categoria.tipoSuplementos.length; j++) {
				tipoSuplementosMap[categoria.tipoSuplementos[j].id] = categoria.tipoSuplementos[j];
			}

			var options = getTipoSuplementoTemplate(categoria.tipoSuplementos);
			div.append(getCategoriaSuplementoTemplate(categoria.nombre, i,
					options));

			if (selectedSuplementosObject.hasOwnProperty(categoria.id)) {
				selectOption(
						'select[name="especificacionesSuplementos[' + i
								+ '].tipoSuplemento"] ',
						selectedSuplementosObject[categoria.id].tipoSuplemento.id);
				
				selectOption(
						'select[name="especificacionesSuplementos[' + i
								+ '].cantidad"] ',
						selectedSuplementosObject[categoria.id].cantidad);
			}

		}
	}
	getAPI('/categoriasuplementos?findCategoriaSuplementoesByValid', process);
}

function getCategoriaSuplementoTemplate(categoria, indice,
		tipoSuplementosOptions) {
	return '<div class="row">' + '<div class="col-sm-12">' + '<label>'
			+ categoria + '</label>' + '</div>' + '<div class="form-group">'
			+ '<div class="col-sm-6">'
			+ '<select class="form-control" name="especificacionesSuplementos['
			+ indice + '].tipoSuplemento" id="tipoSuplemento[' + indice
			+ ']" onChange="getUnidadMedida(' + indice
			+ ', this.value)"><option value="">Seleccione opción</option>'
			+ tipoSuplementosOptions + '</select>' + '</div>'
			+ '<div class="col-sm-6">'
			+ '<select class="form-control" name="especificacionesSuplementos['
			+ indice + '].cantidad"></select>' + '</div></div></div>';
}

function getTipoSuplementoTemplate(tipoSuplementos) {
	var res = '';
	for (var i = 0; i < tipoSuplementos.length; i++) {
		res += '<option value="' + tipoSuplementos[i].id + '">'
				+ tipoSuplementos[i].nombre + '</option>';
	}
	return res;
}

function getUnidadMedida(indice, tipoSuplementoId) {
	if (!tipoSuplementosMap.hasOwnProperty(tipoSuplementoId))
		return false;

	var tipoSuplemento = tipoSuplementosMap[tipoSuplementoId];
	var unidadMedida = tipoSuplemento.unidadDeMedida;
	var select = $('select[name="especificacionesSuplementos[' + indice
			+ '].cantidad"]');
	select.find('option').remove();
	select.append('<option value="">Seleccione opción</option>');
	for (var i = tipoSuplemento.valorMin; i <= tipoSuplemento.valorMax; i += tipoSuplemento.incremento) {
		select.append('<option value="' + i + '">' + i + " "
				+ unidadMedida.medida + '</option>');
	}
}
