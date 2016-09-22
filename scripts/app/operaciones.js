function getJSONSchema(data) {
	var newData = {	title: "Especificación",
					type: "object",
					id: "especificacion"};
	newData.properties = {};
	
	for (i in data){
		newData.properties[data[i]["nombre"]] =
			{	title: data[i]["nombre"],
				type: "array",
				format: "table",
				items: {
					oneOf: []
				}
			};
		
		for (j in data[i].tipoDeComidas){
			newData.properties[data[i]["nombre"]].items.oneOf[j] = {
				title: data[i].tipoDeComidas[j]["nombre"],
				type: "object",
				format: "grid",
				properties: {
					Id_tipo: {
						type: "string",
						default: data[i].tipoDeComidas[j].id
					},
					Id_opcion: {
						type: "int",
						title: "Opcion",
						enumSource: [{
						  source: [],
						  title: "{{item.title}}",
						  value: "{{item.value}}"
						}]
					},
					Porcion: {
						type: "integer",
						enum: []
					},
					Especificar: {
						type: "string"
					}
				}
			};
			
			for (k in data[i].tipoDeComidas[j].opcionComidas) {
				newData.properties[data[i]["nombre"]].items.oneOf[j].properties.Id_opcion.enumSource[0].source[k] = 
				{ value: data[i].tipoDeComidas[j].opcionComidas[k]["id"],
				title: data[i].tipoDeComidas[j].opcionComidas[k]["nombre"] };
			}
			
			var n = 0;
			for (	m=data[i].tipoDeComidas[j].valorMin;
					m<=data[i].tipoDeComidas[j].valorMax;
					m+=data[i].tipoDeComidas[j].incremento) {
				newData.properties[data[i]["nombre"]].items.oneOf[j].properties.Porcion.enum[n] = m;
				n++;
			}
		}
	}
	//console.log(JSON.stringify(newData));
	return newData = JSON.parse(JSON.stringify(newData));
}