function selectOption(id, option) {
	if (option) {
		$(id + ' option[value="' + option + '"]').prop('selected', true)
		$(id).change();
	}
}

function toggleHorarioComida(index, thumb) {
	thumb = $(thumb);
	// thumb.toggleClass('selectedThumb');
	// selectedHorariosComida[index] = !selectedHorariosComida[index];
	for (var i = 0; i < selectedHorariosComida.length; i++) {
		selectedHorariosComida[i] = false;
	}
	selectedHorariosComida[index] = true;
}

function seleccionarHorario() {
	$('#horarioEspecificacion').show();
	$('#especificacion_solida').hide();

	$('ol.breadcrumb li').removeClass("active");
	$('ol.breadcrumb li').hide();
	$('ol.breadcrumb li.horarioEspecificacionBread').addClass("active");
	$('ol.breadcrumb li.horarioEspecificacionBread').show();
}

function continuar() {
	$('#horarioEspecificacion').hide();
	$('#especificacion_solida').show();

	$('ol.breadcrumb li').removeClass("active");
	$('ol.breadcrumb li').hide();
	$('ol.breadcrumb li.horarioEspecificacionBread').show();
	$('ol.breadcrumb li.especificacionSolidaBread').show();
	$('ol.breadcrumb li.especificacionSolidaBread').addClass("active");

	$('input[name="selectedHorariosDesayuno"]').val(selectedHorariosComida[0]);
	$('input[name="selectedHorariosAlmuerzo"]').val(selectedHorariosComida[1]);
	$('input[name="selectedHorariosOnce"]').val(selectedHorariosComida[2]);
	$('input[name="selectedHorariosCena"]').val(selectedHorariosComida[3]);

	getAllCategorias();
}

function getAllCategorias() {
	$('.espSolidaHorario').hide();
	if (selectedHorariosComida[0]) {
		if (categoriasComidasDesayuno.length <= 0) {
			getCategoriasDesayuno();
		}
		$('#especificacionSolidaDesayuno').show();
	}

	if (selectedHorariosComida[1]) {
		if (categoriasComidasAlmuerzo.length <= 0) {
			getCategoriasAlmuerzo();
		}
		$('#especificacionSolidaAlmuerzo').show();
	}

	if (selectedHorariosComida[2]) {
		if (categoriasComidasOnce.length <= 0) {
			getCategoriasOnce();
		}
		$('#especificacionSolidaOnce').show();
	}

	if (selectedHorariosComida[3]) {
		if (categoriasComidasCena.length <= 0) {
			getCategoriasCena();
		}
		$('#especificacionSolidaCena').show();
	}

}

function subtractCategoriaComida(idTipoHorario, index) {
	var divId = '#categoria_' + idTipoHorario + '_' + index;
	$(divId).remove();

	for (var i = index + 1; i < indexCategoriaByHorario[idTipoHorario]; i++) {
		var regExpString = "/.*" + idTipoHorario + ".+.*" + i + "/";

		// change names
		var elements = $('*[name]').filter(function() {
			return this.name.match(new RegExp(regExpString.slice(1, -1)))
		});

		for (var j = 0; j < elements.length; j++) {
			var element = elements[j];
			var name = element.name;
			var n = name.lastIndexOf("[" + i + "]");
			name = name.slice(0, n)
					+ name.slice(n).replace("[" + i + "]", "[" + (i - 1) + "]");
			$(element).attr('name', name);

			if (!((typeof (element.onchange) == 'undefined') || (element.onchange == null))) {
				$(element).attr(
						'onchange',
						"getOpciones(this.value, " + idTipoHorario + ", "
								+ (i - 1) + ");");
			}
		}

		// change ids
		elements = $('*[id]').filter(function() {
			return this.id.match(new RegExp(regExpString.slice(1, -1)))
		});

		for (var j = 0; j < elements.length; j++) {
			var element = elements[j];
			var id = element.id;
			var n = id.lastIndexOf(i);
			id = id.slice(0, n) + id.slice(n).replace(i, (i - 1));
			$(element).attr('id', id);

			if (!((typeof (element.onclick) == 'undefined') || (element.onclick == null))) {
				$(element).attr(
						'onclick',
						"subtractCategoriaComida(" + idTipoHorario + ", "
								+ (i - 1) + ");");
			}
		}
	}
	indexCategoriaByHorario[idTipoHorario]--;
}

// agrega una fila con categoria de comida
function addCategoriaComida(categoriaId, idTipoHorario, div,
		includeTitleWhenNeccesary, requiresCloseButton) {
	var categoria = categoriasComidas[categoriaId];
	var index = indexCategoriaByHorario[idTipoHorario];
	var templateOpcionesTipoComida = getTemplateOpcionesTipoComida(categoria.tipoDeComidas);
	var templateCategoria = getCategoriaTemplate(categoriaId, idTipoHorario,
			index, templateOpcionesTipoComida, requiresCloseButton);

	if (includeTitleWhenNeccesary === true
			&& categoria.tipoDeComidas.length > 1) {
		templateCategoria = getTituloCategoriaTemplate(categoria.nombre)
				+ templateCategoria;
	}

	$(div).append(templateCategoria);

	if (categoria.tipoDeComidas.length == 1) {
		getOpciones(categoria.tipoDeComidas[0].id, idTipoHorario, index);
	}

	indexCategoriaByHorario[idTipoHorario]++;
}

function setCategoriasComidas(categorias, idTipoHorario, div) {
	for (var i = 0; i < categorias.length; i++) {
		categoriasComidas[categorias[i].id] = categorias[i];
		for (var j = 0; j < categorias[i].tipoDeComidas.length; j++) {
			tipoComidasMap[categorias[i].tipoDeComidas[j].id] = categorias[i].tipoDeComidas[j];
		}
		var divId = 'horario_' + idTipoHorario + '_categoria_'
				+ categorias[i].id;
		$(div).append('<div id="' + divId + '"></div>');
		addCategoriaComida(categorias[i].id, idTipoHorario, '#' + divId, true,
				false);
		$(div)
				.append(
						'<div class="col-sm-12 col-xs-12 form-group"><div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
								+ '<button type="button" class="btn btn-default" onClick="addCategoriaComida('
								+ categorias[i].id
								+ ', '
								+ idTipoHorario
								+ ', \'#'
								+ divId
								+ '\', false, true);">+</button><hr></div></div>');
	}
}

function poblarFormularioComidaConJSON(idTipoHorario) {
	// el que viene por post
	if (selectedHorariosComida[idTipoHorario]
			&& especificacionSolidaListJSON.length >= (idTipoHorario + 1)) {
		poblarFormularioComida(idTipoHorario,
				especificacionSolidaListJSON[idTipoHorario]);
	}// el actual
	else if (especificacionSolidaActual[idTipoHorario] != null) {
		poblarFormularioComida(idTipoHorario,
				especificacionSolidaActual[idTipoHorario]);
	}//el historico
	else if (especificacionSolidaUltima[idTipoHorario] != null) {
		poblarFormularioComida(idTipoHorario,
				especificacionSolidaUltima[idTipoHorario]);
	}	
	// los que vienen por post, pero por ser alguna vez completados (tiene
	// preferencia el historico)
	else if (especificacionSolidaListJSON.length >= (idTipoHorario + 1)) {
		poblarFormularioComida(idTipoHorario,
				especificacionSolidaListJSON[idTipoHorario]);
	}
}

function poblarFormularioComida(idTipoHorario, especificacionSolida) {

	if (especificacionSolida.fechaComidaFormatted != null) {
		$('#fechaComida_' + idTipoHorario).val(
				especificacionSolida.fechaComidaFormatted).change();
	}
	if (especificacionSolida.noEspecificar != null) {

		$(
				'input:radio[name="especificacionSolidaList[' + idTipoHorario
						+ '].noEspecificar"]').filter(
				'[value="' + especificacionSolida.noEspecificar + '"]').attr(
				'checked', true).change();
	}
	var especificacionesComidasListObject = {};
	var filasPorCategoria = {};
	// primero ordenar seguro categoria
	for (var indiceElemento = 0; indiceElemento < especificacionSolida.especificacionesComidasList.length; indiceElemento++) {
		var especificacionesComida = especificacionSolida.especificacionesComidasList[indiceElemento];
		if (especificacionesComida.tipoComida == null) {
			// ojo aca hay que eliminar algunos elementos (o actulizar)
			continue;
		}
		var categoria = especificacionesComida.tipoComida.categoria.id;
		if (!especificacionesComidasListObject.hasOwnProperty(categoria)) {
			especificacionesComidasListObject[categoria] = [];
		}
		if (!filasPorCategoria.hasOwnProperty(categoria)) {
			filasPorCategoria[categoria] = [];
			var filas = $('#horario_' + idTipoHorario + '_' + 'categoria_'
					+ categoria + '>[id^="categoria_' + idTipoHorario + '_"]');
			if (filas.length > 0) {
				for (var i = 0; i < filas.length; i++) {
					var fila = filas[i];
					var num = fila.id.replace('categoria_' + idTipoHorario
							+ '_', '');
					filasPorCategoria[categoria].push(parseInt(num));
				}
			}
		}
		especificacionesComidasListObject[categoria]
				.push(especificacionesComida);
	}

	// traverse by categoria
	for ( var categoria in especificacionesComidasListObject) {
		var especificacionesComidaList = especificacionesComidasListObject[categoria];

		for (var indiceElemento = 0; indiceElemento < especificacionesComidaList.length; indiceElemento++) {
			var especificacionesComida = especificacionesComidaList[indiceElemento];

			var indiceElementoPoblar = indexCategoriaByHorario[idTipoHorario];

			if (filasPorCategoria.hasOwnProperty(categoria)
					&& filasPorCategoria[categoria].length > 0) {
				// ya existe
				indiceElementoPoblar = filasPorCategoria[categoria][0];
				filasPorCategoria[categoria].splice(0, 1);
			} else {
				var divId = '#horario_' + idTipoHorario + '_categoria_'
						+ especificacionesComida.tipoComida.categoria.id;
				addCategoriaComida(
						especificacionesComida.tipoComida.categoria.id,
						idTipoHorario, divId, false, true);
			}

			$(
					'[name="especificacionSolidaList[' + idTipoHorario
							+ '].especificacionesComidasList['
							+ indiceElementoPoblar + '].tipoComida"]').val(
					especificacionesComida.tipoComida.id).change();

			if (especificacionesComida.opcionComida != null) {
				$(
						'[name="especificacionSolidaList[' + idTipoHorario
								+ '].especificacionesComidasList['
								+ indiceElementoPoblar + '].opcionComida"]')
						.val(especificacionesComida.opcionComida.id).change();
			}

			var attrList = [ "cantidad", "especificacion" ];
			for (var j = 0; j < attrList.length; j++) {
				var valor = especificacionesComida[attrList[j]];
				if (valor != null) {
					$(
							'[name="especificacionSolidaList[' + idTipoHorario
									+ '].especificacionesComidasList['
									+ indiceElementoPoblar + '].' + attrList[j]
									+ '"]').val(valor).change();
				}
			}
		}
	}

}

function getEspecificacionSolidaActual(dia, horario, idHorario) {
	process = function(response) {
		if (response.length > 0) {
			especificacionSolidaActual[idHorario] = response[0];
			especificacionSolidaActual[idHorario].fechaComidaFormatted = dia;
			especificacionSolidaActual[idHorario].especificacionesComidasList = especificacionSolidaActual[idHorario].especificacionComidas;

			if (especificacionSolidaActual[idHorario].noEspecificar != null
					&& especificacionSolidaActual[idHorario].noEspecificar) {
				$('#estadoHorario' + horario).append(
						getEstadoHorarioTemplateNoEspecificar());
			} else {
				$('#estadoHorario' + horario).append(
						getEstadoHorarioTemplateCompletado());
			}

		} else {
			$('#estadoHorario' + horario).append(
					getEstadoHorarioTemplateNoCompletado());
		}
	}
	var fichaPaciente = $('form>[name="fichaPaciente"]').val();
	getAPI(
			'/especificacionsolidas?find=ByFechaComidaAndFichaPacienteAndHorarioComida&fechaComida='
					+ dia
					+ '&fichaPaciente='
					+ fichaPaciente
					+ '&horarioComida=' + horario, process);
}

function getEspecificacionSolidaUltima(dia, horario, idHorario) {
	process = function(response) {
		if (response.length > 0) {
			especificacionSolidaUltima[idHorario] = response[0];
			especificacionSolidaUltima[idHorario].fechaComidaFormatted = dia;
			especificacionSolidaUltima[idHorario].especificacionesComidasList = especificacionSolidaUltima[idHorario].especificacionComidas;
		}
	}
	var fichaPaciente = $('form>[name="fichaPaciente"]').val();
	getAPI(
			'/especificacionsolidas?find=LastEspecificacionSolidaByFichaPacienteAndHorarioComida&fichaPaciente='
					+ fichaPaciente + '&horarioComida=' + horario, process);
}

function getCategoriasDesayuno() {
	process = function(response) {
		categoriasComidasDesayuno = response;
		var idTipoHorario = 0;
		setCategoriasComidas(response, idTipoHorario, '#formularioHorario_0');
		poblarFormularioComidaConJSON(idTipoHorario);
	}
	getAPI(
			'/categoriacomidas?find=ByValidAndDesayuno&valid=true&desayuno=true',
			process);
}

function getCategoriasAlmuerzo() {
	process = function(response) {
		categoriasComidasAlmuerzo = response;
		var idTipoHorario = 1;
		setCategoriasComidas(response, idTipoHorario, '#formularioHorario_1');
		poblarFormularioComidaConJSON(idTipoHorario);
	}
	getAPI(
			'/categoriacomidas?find=ByValidAndAlmuerzo&valid=true&almuerzo=true',
			process);
}

function getCategoriasOnce() {
	process = function(response) {
		categoriasComidasOnce = response;
		var idTipoHorario = 2;
		setCategoriasComidas(response, idTipoHorario, '#formularioHorario_2');
		poblarFormularioComidaConJSON(idTipoHorario);
	}
	getAPI('/categoriacomidas?find=ByValidAndOnce&valid=true&once=true',
			process);
}

function getCategoriasCena() {
	process = function(response) {
		categoriasComidasCena = response;
		var idTipoHorario = 3;
		setCategoriasComidas(response, idTipoHorario, '#formularioHorario_3');
		poblarFormularioComidaConJSON(idTipoHorario);
	}
	getAPI('/categoriacomidas?find=ByValidAndCena&valid=true&cena=true',
			process);
}

function getOpciones(idTipoComida, indiceEspSolida, indiceEspComida) {
	
	var selectPorcion = $('select[name="especificacionSolidaList['
			+ indiceEspSolida + '].especificacionesComidasList['
			+ indiceEspComida + '].cantidad"]');
	var selectOpcionComida = $('select[name="especificacionSolidaList['
			+ indiceEspSolida + '].especificacionesComidasList['
			+ indiceEspComida + '].opcionComida"]');
	
	selectPorcion.find('option').remove();
	selectOpcionComida.find('option').remove();
	
	if (!tipoComidasMap.hasOwnProperty(idTipoComida)){
		return false;
	}
	
	var tipoComida = tipoComidasMap[idTipoComida];
	selectPorcion.append(getPorcionTemplate(tipoComida));
	selectOpcionComida.append(getOpcionTemplate(tipoComida));

}

function getPorcionTemplate(tipoDeComida) {
	var template = '';
	for (var i = tipoDeComida.valorMin; i <= tipoDeComida.valorMax; i = i
			+ tipoDeComida.incremento) {
		template += '<option value="' + i + '">' + i + '</option>';
	}
	return template;
}

function getOpcionTemplate(tipoDeComida) {
	var opcionesDeComida = tipoDeComida.opcionComidas;
	var template = '';
	if (opcionesDeComida.length > 0) {
		template += '<option value="">Seleccione opción</option>';
	} else {
		template += '<option value="">-</option>';
	}
	for (var i = 0; i < opcionesDeComida.length; i++) {
		template += '<option value="' + opcionesDeComida[i].id + '">'
				+ opcionesDeComida[i].nombre + '</option>';
	}
	return template;
}

function getCategoriaTemplate(categoriaId, idHorarioComida,
		idEspecificacionComida, templateOpcionesTipoComida, requiresCloseButton) {

	var onClickClose = '';
	var enabledClose = '';

	if (requiresCloseButton) {
		onClickClose = 'onclick="subtractCategoriaComida(' + idHorarioComida
				+ ', ' + idEspecificacionComida + ')"';
	} else {
		enabledClose = 'disabled';
	}

	var template = '<div class="col-sm-12 form-group" id="categoria_'
			+ idHorarioComida + '_' + idEspecificacionComida + '">'
			+ '<div class="col-lg-2 col-md-4 col-sm-4 col-xs-4">'
			+ '<div class="input-group">' + '<div class="input-group-btn">'
			+ '<button type="button" id="boton_cerrar_' + idHorarioComida + '_'
			+ idEspecificacionComida
			+ '" class="btn btn-default" aria-label="Close" ' + onClickClose
			+ ' ' + enabledClose
			+ '><span aria-hidden="true">&times;</span></button></div>'
			+ '<input type="hidden" name="especificacionSolidaList['
			+ idHorarioComida + '].especificacionesComidasList['
			+ idEspecificacionComida + '].tipoComida.categoria.id" value="'
			+ categoriaId + '"/>' + '<select class="form-control"'
			+ '	name="especificacionSolidaList[' + idHorarioComida
			+ '].especificacionesComidasList[' + idEspecificacionComida
			+ '].tipoComida" onchange="getOpciones(this.value, '
			+ idHorarioComida + ', ' + idEspecificacionComida + ')">'
			+ templateOpcionesTipoComida + '</select></div>' + '</div>'
			+ '<div class="col-lg-2 col-md-3 col-sm-3 col-xs-3">'
			+ '<select class="form-control"'
			+ '	name="especificacionSolidaList[' + idHorarioComida
			+ '].especificacionesComidasList[' + idEspecificacionComida
			+ '].opcionComida"></select></div>'
			+ '<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">'
			+ '	<select class="form-control"'
			+ '	name="especificacionSolidaList[' + idHorarioComida
			+ '].especificacionesComidasList[' + idEspecificacionComida
			+ '].cantidad"></select></div>'
			+ '<div class="col-lg-2 col-md-3 col-sm-3 col-xs-3">'
			+ '	<input type="text" class="form-control"'
			+ '	name="especificacionSolidaList[' + idHorarioComida
			+ '].especificacionesComidasList[' + idEspecificacionComida
			+ '].especificacion" />' + '</div>' + '</div>';
	return template;
}

function getTituloCategoriaTemplate(nombreCategoria) {
	var template = '<div class="col-sm-12">'
			+ '<div class="col-lg-2 col-md-3 col-sm-3 col-xs-3"><label>'
			+ nombreCategoria + '</label></div>'
			+ '<div class="col-lg-10 col-md-9 col-sm-9 col-xs-9"></div>'
			+ '</div>';
	return template;
}

function getTemplateOpcionesTipoComida(tipoComidaList) {
	if (tipoComidaList.length <= 0)
		return '<option value="">-</option>';

	var template = '';
	if (tipoComidaList.length > 1)
		template = '<option value="">Seleccione opción</option>';

	for (var i = 0; i < tipoComidaList.length; i++) {
		template += '<option value="' + tipoComidaList[i].id + '">'
				+ tipoComidaList[i].nombre + '</option>';
	}
	return template;
}

function changeFechaComida(idComida, fecha) {
	$(
			'[name="especificacionSolidaList[' + idComida
					+ '].fechaComidaFormatted"]').val(fecha);
	$('#fechaComidaDisabled_' + idComida).val(fecha);
}

function getEstadoHorarioTemplateNoCompletado() {
	return '<span class="input-group-addon warning"><span class="glyphicon glyphicon-question-sign"></span></span>';
}

function getEstadoHorarioTemplateCompletado() {
	return '<span class="input-group-addon success"><span class="glyphicon glyphicon-ok-circle"></span></span>';
}

function getEstadoHorarioTemplateNoEspecificar() {
	return '<span class="input-group-addon info"><span class="glyphicon glyphicon-ban-circle"></span></span>';
}

function toogleForm(idHorario) {
	if ($(
			'[name="especificacionSolidaList[' + idHorario
					+ '].noEspecificar"]:checked').val() === 'true') {
		$('#formularioHorario_' + idHorario).hide();
	} else {
		$('#formularioHorario_' + idHorario).show();
	}
}