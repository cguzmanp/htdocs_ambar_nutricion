var unidades = {};
var salas = {};
var hospitalizados = {};
var hospitalizadosUnidadSalas = {};// hash map para saber que hospitalizaciones
// estan asociadas a cada unidad/sala

function showUnidades() {
	$('#salas').hide();
	$('#pacientes').hide();
	$('ol.breadcrumb li').removeClass("active");
	$('ol.breadcrumb li').hide();
	$('ol.breadcrumb li.unidades').addClass("active");
	$('ol.breadcrumb li.unidades').show();
	$('#unidades').show();
}

function showSalas(unidad) {
	$('#unidades').hide();
	$('#pacientes').hide();
	$('ol.breadcrumb li').removeClass("active");

	$('ol.breadcrumb li').hide();
	$('ol.breadcrumb li.unidades').show();
	$('ol.breadcrumb li.salas').addClass("active");
	$('ol.breadcrumb li.salas').html(unidad);
	$('ol.breadcrumb li.salas').click(function() {
	});
	$('ol.breadcrumb li.salas').show();

	if (!salas.hasOwnProperty(unidad)) {
		getSalas(unidad);
	} else {
		$('#salas').show();
		$('#salas .salas').hide();
		$('#salas .salas_' + unidad).show();
	}

	getHospitalizados(unidad);
}

function showPacientes(unidad, sala) {
	$('#unidades').hide();
	$('#salas').hide();

	$('ol.breadcrumb li').hide();
	$('ol.breadcrumb li.unidades').show();
	$('ol.breadcrumb li.salas').show();
	$('ol.breadcrumb li').removeClass("active");
	$('ol.breadcrumb li.pacientes').addClass("active");
	$('ol.breadcrumb li.pacientes').html("sala: " + sala);
	$('ol.breadcrumb li.pacientes').click(function() {
	});
	$('ol.breadcrumb li.salas').click(function() {
		showSalas(unidad);
	});
	$('ol.breadcrumb li.pacientes').show();

	$('#pacientes').show();

	var template = Handlebars.compile($('#pacienteTemplate').html());
	$('#pacientes').html(template({'idHospitalizaciones': hospitalizadosUnidadSalas[unidad][sala]}));

}

function updatePacientesSalas(unidad) {
	if (salas[unidad])
		$.each(salas[unidad], function(key, sala) {
			var salaObject = $('#salas .salas_' + unidad + ' .salas_pacientes_'
					+ sala.id.salSala);
			
			var template = Handlebars.compile($('#pacienteSalaTemplate').html());
			if (salaObject) {
				salaObject.html(template({'idHospitalizaciones': hospitalizadosUnidadSalas[unidad][sala.id.salSala]}));
			}
		});
}

function getUnidades() {
	process = function(response) {
		console.log(response);
		unidades = response;
		var template = Handlebars.compile($('#unidadesTemplate').html());
		$('#unidades').append(template({'unidades':unidades}));
	}
	getAPI('/unidades', process);
}

function getSalas(unidad) {
	process = function(response) {
		salas[unidad] = response;
		if (!$('#salas .salas_' + unidad)[0]) {
			$('#salas')
					.append('<div class="salas salas_' + unidad + '"></div>');
		}
		
		var template = Handlebars.compile($('#salasTemplate').html());
		var data = {'unidad': unidad, 'salas':response};
		$('#salas .salas_' + unidad).append(template(data));

		$('#salas').show();
		$('#salas .salas').hide();
		$('#salas .salas_' + unidad).show();
	}
	getAPI('/salas?find=BySalUnidadAndSalValida&salUnidad=' + unidad
			+ '&salValida=true', process);
}

function getHospitalizados(unidad) {

	process = function(response) {
		var idList = [];
		for (var i = 0; i < response.length; i++) {
			hospitalizados[response[i].id] = response[i];
			idList.push(response[i].id);
		}
		
		Handlebars.registerHelper('hospitalizados', function(id, key) {
			  return hospitalizados[id][key];
		});
		Handlebars.registerHelper('hospitalizadosPaciente', function(id, key) {
			  return hospitalizados[id].paciente[key];
		});
		
		getInformacionHospitalizacion(idList.toString(), unidad);
	}
	getAPI('/hospitalizaciones/hospitalizados', process);
}

function getInformacionHospitalizacion(idList, unidad) {
	process = function(response) {

		var idList = [];
		hospitalizadosUnidadSalas = {};
		for (var i = 0; i < response.length; i++) {
			if (hospitalizados.hasOwnProperty(response[i].id)) {
				hospitalizados[response[i].id]["infoHospitalizacion"] = response[i];
				hospitalizados[response[i].id]["unidad"] = response[i].unidad;
				hospitalizados[response[i].id]["sala"] = response[i].sala;
				hospitalizados[response[i].id]["cama"] = response[i].cama;
				idList.push(response[i].pacId);

				if (!hospitalizadosUnidadSalas
						.hasOwnProperty(response[i].unidad)) {
					hospitalizadosUnidadSalas[response[i].unidad] = {};
				}
				if (!hospitalizadosUnidadSalas[response[i].unidad]
						.hasOwnProperty(response[i].sala)) {
					hospitalizadosUnidadSalas[response[i].unidad][response[i].sala] = [];// array
				}
				hospitalizadosUnidadSalas[response[i].unidad][response[i].sala]
						.push(response[i].id);
			}
		}
		getPaciente(idList.toString(), unidad);
	}
	getAPI('/informaciondehospitalizaciones/in_list/' + idList, process);
}

function getPaciente(idList, unidad) {
	process = function(response) {
		var pacienteList = {};
		for (var i = 0; i < response.length; i++) {
			pacienteList[response[i].ficha] = response[i];
		}

		$
				.each(
						hospitalizados,
						function(key, val) {
							if (pacienteList
									.hasOwnProperty(hospitalizados[key].idfichaFk))
								hospitalizados[key].paciente = pacienteList[hospitalizados[key].idfichaFk];
						});
		updatePacientesSalas(unidad);
		return;
	}
	getAPI('/pacientes/in_list/' + idList, process);

}