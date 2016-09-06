var unidades = {};
var salas = {};
var hospitalizados = {};
var hospitalizadosUnidadSalas = {};// hash map para saber que hospitalizaciones
// estan asociadas a cada unidad/sala
var especificacionSolidaPaciente = [ {}, {}, {}, {} ];// hash map para saber
// la especificacion
// solida segun la ficha del paciente
var selectedUnidad = '';
var selectedHorario = [ false, false, false, false ];
var horarioInicializado = false;

var horariosData = {
	'horarios' : [ {
		'id' : 0,
		'nombrehorario' : 'Desayuno',
		'imagen' : 'desayuno'
	}, {
		'id' : 1,
		'nombrehorario' : 'Almuerzo',
		'imagen' : 'almuerzo'
	}, {
		'id' : 2,
		'nombrehorario' : 'Once',
		'imagen' : 'once'
	}, {
		'id' : 3,
		'nombrehorario' : 'Cena',
		'imagen' : 'cena'
	} ]
};

function showUnidades() {
	$('#horario').hide();
	$('#reporte').hide();
	$('ol.breadcrumb li').removeClass("active");
	$('ol.breadcrumb li').hide();
	$('ol.breadcrumb li.unidades').html('Unidades');
	$('ol.breadcrumb li.unidades').addClass("active");
	$('ol.breadcrumb li.unidades').show();
	$('#unidades').show();
	selectedUnidad = '';
}

function selectUnidad(id) {
	selectedUnidad = id;
	showHorarios(id);
}

function selectHorario(id) {
	selectedHorario[id] = !selectedHorario[id];
	if (selectedHorario[id]) {
		$('#boton' + id).addClass("selectedThumb");
	} else {
		$('#boton' + id).removeClass("selectedThumb");
	}
}

function showHorarios(unidad) {
	$('#unidades').hide();
	$('#reporte').hide();
	$('ol.breadcrumb li').removeClass("active");

	$('ol.breadcrumb li').hide();
	$('ol.breadcrumb li.unidades').show();
	$('ol.breadcrumb li.unidades').html('Unidad: ' + unidad);
	;
	$('ol.breadcrumb li.horario').addClass("active");
	$('ol.breadcrumb li.horario').html("Horarios");
	$('ol.breadcrumb li.horario').click(function() {
	});
	$('ol.breadcrumb li.horario').show();

	if (!horarioInicializado) {
		var template = Handlebars.compile($('#horariosTemplate').html());
		$('#horario').append(template(horariosData));
		horarioInicializado = true;
	}

	$('#horario').show();
}
function showReporte(horario) {
	$('#unidades').hide();
	$('#horario').hide();
	$('ol.breadcrumb li').removeClass("active");

	$('ol.breadcrumb li.reporte').addClass("active");
	$('ol.breadcrumb li.reporte').click(function() {
	});
	$('ol.breadcrumb li.horario').click(function() {
		showHorarios(selectedUnidad);
	});
	$('ol.breadcrumb li.reporte').show();
	$('#reporte').show();

	getEspecificacionesSolidas(selectedUnidad, selectedHorario);
	$('#reporte').html('');
}

function getUnidades() {
	process = function(response) {
		unidades = response;
		var template = Handlebars.compile($('#unidadesTemplate').html());
		$('#unidades').append(template({
			'unidades' : unidades
		}));
	}
	getAPI('/unidades', process);
}

function getHospitalizados() {

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

		getInformacionHospitalizacion(idList.toString());
	}
	getAPI('/hospitalizaciones/hospitalizados', process);
}

function getInformacionHospitalizacion(idList) {
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
		getPaciente(idList.toString());
	}
	getAPI('/informaciondehospitalizaciones/in_list/' + idList, process);
}

function getPaciente(idList) {
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
		return;
	}
	getAPI('/pacientes/in_list/' + idList, process);

}

function getNombreHorarioById(id) {
	return horariosData.horarios[id].nombrehorario;
}

function getEspecificacionesSolidas(unidad) {
	process = function(horarioId, printTemplate) {
		return function(response) {
			especificacionSolidaPaciente[horarioId] = {};
			for (var i = 0; i < response.length; i++) {
				if (!especificacionSolidaPaciente[horarioId]
						.hasOwnProperty(response[i].fichaPaciente)) {
					especificacionSolidaPaciente[horarioId][response[i].fichaPaciente] = {};
				}

				for (var j = 0; j < response[i].especificacionComidas.length; j++) {
					var especificacionComida = response[i].especificacionComidas[j];
					var nombreCategoria = especificacionComida.tipoComida.categoria.nombre;
					if (!especificacionSolidaPaciente[horarioId][response[i].fichaPaciente]
							.hasOwnProperty(nombreCategoria)) {
						especificacionSolidaPaciente[horarioId][response[i].fichaPaciente][nombreCategoria] = [];
					}
					especificacionSolidaPaciente[horarioId][response[i].fichaPaciente][nombreCategoria]
							.push(especificacionComida);
				}
			}

			if (printTemplate) {
				setReporteTemplate(unidad);
			}

			return;
		}
	}
	var pacienteList = '';
	var hospitalizadosUnidad = hospitalizadosUnidadSalas[unidad];
	for ( var sala in hospitalizadosUnidad) {
		var pacienteIds = hospitalizadosUnidad[sala];
		if (pacienteIds != null && pacienteIds.length > 0) {
			for (var i = 0; i < pacienteIds.length; i++) {
				pacienteList += hospitalizados[pacienteIds[i]].idfichaFk + ",";

			}
		}
	}
	pacienteList = pacienteList.trim();
	pacienteList = pacienteList.substring(0, pacienteList.length - 1);

	var lastHorario = 0;
	for (var i = 0; i < selectedHorario.length; i++) {
		if (selectedHorario[i]) {
			lastHorario = i;
		}
	}

	for (var i = 0; i < selectedHorario.length; i++) {
		if (selectedHorario[i]) {
			var fecha = $('#fechaComida_' + i).val();
			getAPI(
					'/especificacionsolidas?find=ByFichaPacienteListAndHorarioComidaAndFechaComida&fechaComida='
							+ fecha
							+ '&fichaPacienteList='
							+ pacienteList
							+ '&horarioComida=' + getNombreHorarioById(i),
					process(i, i == lastHorario));
		}
	}
}

function setReporteTemplate(unidad) {
	var template = Handlebars.compile($('#reporteTemplate').html());
	var especificacionesSolidasAux = {};
	var hospitalizadosUnidad = hospitalizadosUnidadSalas[unidad];
	for ( var sala in hospitalizadosUnidad) {
		var pacienteIds = hospitalizadosUnidad[sala];
		if (pacienteIds != null && pacienteIds.length > 0) {
			for (var i = 0; i < pacienteIds.length; i++) {
				var fichaPaciente = hospitalizados[pacienteIds[i]].idfichaFk;

				var numElementosPorHorario = [ 0, 0, 0, 0 ];
				for (var horarioId = 0; horarioId < selectedHorario.length; horarioId++) {
					if (selectedHorario[horarioId]) {
						if (especificacionSolidaPaciente[horarioId]
								.hasOwnProperty(fichaPaciente)) {

							if (!especificacionesSolidasAux
									.hasOwnProperty(fichaPaciente)) {
								especificacionesSolidasAux[fichaPaciente] = {};
								especificacionesSolidasAux[fichaPaciente]['paciente'] = hospitalizados[pacienteIds[i]].paciente;
								especificacionesSolidasAux[fichaPaciente]['paciente']['sala'] = hospitalizados[pacienteIds[i]].sala;
								especificacionesSolidasAux[fichaPaciente]['paciente']['cama'] = hospitalizados[pacienteIds[i]].cama;
							}
							if (!especificacionesSolidasAux[fichaPaciente]
									.hasOwnProperty('comidas')) {
								especificacionesSolidasAux[fichaPaciente]['comidas'] = {};
							}

							especificacionesSolidasAux[fichaPaciente]['comidas'][getNombreHorarioById(horarioId)] = especificacionSolidaPaciente[horarioId][fichaPaciente];
							numElementosPorHorario[horarioId] = Object
									.keys(especificacionesSolidasAux[fichaPaciente]['comidas'][getNombreHorarioById(horarioId)]).length
						}
					}
				}

				if (!especificacionesSolidasAux.hasOwnProperty(fichaPaciente)) {
					continue;
				}

				if (!especificacionesSolidasAux[fichaPaciente]
						.hasOwnProperty('headers')) {
					especificacionesSolidasAux[fichaPaciente]['headers'] = [];
				}
				if (!especificacionesSolidasAux[fichaPaciente]
						.hasOwnProperty('rows')) {
					especificacionesSolidasAux[fichaPaciente]['rows'] = {};
				}

				for (var horarioId = 0; horarioId < selectedHorario.length; horarioId++) {

					if (selectedHorario[horarioId]) {

						especificacionesSolidasAux[fichaPaciente]['headers']
								.push(getNombreHorarioById(horarioId));
						var numCategoriasMaxPorHorario = Math.max.apply(null,
								numElementosPorHorario);
						for (var k = 1; k <= numCategoriasMaxPorHorario; k++) {
							if (!especificacionesSolidasAux[fichaPaciente]['rows']
									.hasOwnProperty(k)) {
								especificacionesSolidasAux[fichaPaciente]['rows'][k] = [];
							}
							var keys = [];
							if (especificacionesSolidasAux[fichaPaciente]['comidas'][getNombreHorarioById(horarioId)] != null)
								keys = Object
										.keys(especificacionesSolidasAux[fichaPaciente]['comidas'][getNombreHorarioById(horarioId)])
							if (keys.length >= k) {
								var data = {};
								data[keys[k - 1]] = especificacionesSolidasAux[fichaPaciente]['comidas'][getNombreHorarioById(horarioId)][keys[k - 1]];
								especificacionesSolidasAux[fichaPaciente]['rows'][k]
										.push(data);
							} else {
								especificacionesSolidasAux[fichaPaciente]['rows'][k]
										.push({});
							}
						}
					}
				}

				if (especificacionesSolidasAux.hasOwnProperty(fichaPaciente)) {
					console.log(especificacionesSolidasAux[fichaPaciente]);
					$('#reporte')
							.append(
									template(especificacionesSolidasAux[fichaPaciente]));
				}
			}
		}
	}
}
