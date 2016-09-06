var especificacionSolida = {};// hash map para saber la
// especificacion
// solida segun la ficha del paciente
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

function selectHorario(id) {
	selectedHorario[id] = !selectedHorario[id];
	if (selectedHorario[id]) {
		$('#boton' + id).addClass("selectedThumb");
	} else {
		$('#boton' + id).removeClass("selectedThumb");
	}
}

function showHorarios() {
	$('#reporte').hide();
	$('ol.breadcrumb li').removeClass("active");
	$('ol.breadcrumb li').hide();
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

function getNombreHorarioById(id) {
	return horariosData.horarios[id].nombrehorario;
}

function verProduccion() {
	var count = 0;
	for (var i = 0; i < selectedHorario.length; i++) {
		if (selectedHorario[i]) {
			count++;
			var fecha = $('#fechaComida_' + i);
			if (!(fecha.length > 0 && fecha.val() != null && fecha.val().length > 0)) {
				alert('Debe seleccionar una fecha para el horario: '
						+ getNombreHorarioById(i));
				return;
			}
		}
	}
	if (count > 0) {
		showReporte();
	} else {
		alert('Debe seleccionar algún horario');
	}
}

function showReporte() {
	$('#horario').hide();
	$('ol.breadcrumb li').removeClass("active");

	$('ol.breadcrumb li.reporte').addClass("active");
	$('ol.breadcrumb li.reporte').click(function() {
	});
	$('ol.breadcrumb li.horario').click(function() {
		showHorarios();
	});
	$('ol.breadcrumb li.reporte').show();
	$('#reporte').show();

	$('#reporte').html('');
	especificacionSolida = {};

	var index = 0;
	for (var i = 0; i < selectedHorario.length; i++)
		if (selectedHorario[i])
			index = i;

	for (var i = 0; i < selectedHorario.length; i++) {
		if (selectedHorario[i]) {
			getEspecificacionesSolidas(i, $('#fechaComida_' + i).val(),
					i == index);
		}
	}

}

function digestEspecificacionComida(especificacionComida) {
	
	var id = especificacionComida.tipoComida.nombre.toLowerCase();
	var nombre = especificacionComida.tipoComida.nombre;
	var especial = especificacionComida.tipoComida.pedidoEspecial;
	if (nombre.indexOf('OTRO') > -1) {
		id = 'otro';
		nombre = 'OTRO';
	}

	if (especificacionComida.opcionComida) {
		id += '_' + especificacionComida.opcionComida.nombre.toLowerCase();
		nombre += ' ' + especificacionComida.opcionComida.nombre;
	}
	if (especificacionComida.tipoComida.pedidoEspecial
			|| nombre.indexOf('OTRO') > -1 || nombre.indexOf('ESP') > -1) {
		id += '_' + especificacionComida.especificacion.trim().toLowerCase();
		nombre += ' ' + especificacionComida.especificacion.trim();
	}
	return {
		'id' : id.trim(),
		'nombre' : nombre.trim(),
		'cantidad' : especificacionComida.cantidad,
		'especial' : especial
	};
}

function getEspecificacionesSolidas(horarioId, fecha, generarReporte) {
	process = function(response) {

		for (var i = 0; i < response.length; i++) {
			for (var j = 0; j < response[i].especificacionComidas.length; j++) {
				var comida = digestEspecificacionComida(response[i].especificacionComidas[j]);
				if (!especificacionSolida.hasOwnProperty(comida.id)) {
					especificacionSolida[comida.id] = {
						'nombre' : comida.nombre,
						'cantidad' : 0,
						'especial' : comida.especial
					};
				}
				especificacionSolida[comida.id].cantidad = especificacionSolida[comida.id].cantidad
						+ comida.cantidad;
			}
		}

		if (generarReporte) {
			var arrayNoEspecial = [];
			var arrayEspecial = [];
			
			for (key in especificacionSolida) {
		        if (especificacionSolida[key].especial) {
		        	arrayEspecial.push(especificacionSolida[key]);
		        }else{
		        	arrayNoEspecial.push(especificacionSolida[key]);
		        }
		    }
			
			var template = Handlebars.compile($('#reporteProduccionTemplate')
					.html());
			$('#reporte').append(template({
				'especificacionComidas' : arrayNoEspecial.concat(arrayEspecial)
			}));
		}

		return;
	}
	
	getAPI(
			'/especificacionsolidas?find=ByFechaComidaAndHorarioComida&fechaComida='
					+ fecha + '&horarioComida='
					+ getNombreHorarioById(horarioId), process);

}
