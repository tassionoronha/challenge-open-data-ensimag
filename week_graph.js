function draw_linear_week_graph(jsonData) {
	var allDatas = JSON.parse(jsonData);
	console.log(allDatas);

	tab = [];
	var dureePeriode = 7;
	var decalage = 0;
	var nbTour = 0;

	datas = allDatas[0].data;
	var keysJour = Object.keys(datas);
	var valuesJour = Object.values(datas);

	while(getDayInWeek(keysJour[decalage]) != 1){
		decalage++;
	}
	var debutPeriode = decalage;
	console.log("debutPeriode: "+debutPeriode);

	var finPeriode = debutPeriode+dureePeriode;
	while(finPeriode<keysJour.length){
		nbTour++;

		arrayJourValues = [];
		arrayJourValues[0] = "semaine "+nbTour;

		for (var i = 1; i <= dureePeriode; i++) {
			arrayJourValues[i] = valuesJour[debutPeriode+i-1];
		}

		tab[nbTour-1] = arrayJourValues;

		debutPeriode = nbTour*dureePeriode+decalage;
		finPeriode = debutPeriode+dureePeriode;
	}

	console.log("debutPeriode: "+debutPeriode+", nbTour: "+nbTour);

	console.log(tab);

	colorTab = echelleTeintes(nbTour);
	var chart = c3.generate({
		bindto: '#chart',
		data: {
			columns:tab
		},
		axis: {
			x: {
				type: 'category',
				categories: ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']
			}
		},
		color: {
			pattern: echelleTeintes(nbTour)
		}
	});
}


function draw_scatter_plot_week_graph(jsonData) {
	var allDatas = JSON.parse(jsonData);
	console.log(allDatas);

	tab = [];
	var dureePeriode = 7;

	datas = allDatas[0].data;
	var keysJour = Object.keys(datas);
	var valuesJour = Object.values(datas);

	arrayJourPeriode = [];
	arrayJourValues = [];

	arrayJourPeriode[0] = "periode_x";
	arrayJourValues[0] = "periode";

	for (var i = 1; i < valuesJour.length; i++) {
		arrayJourPeriode[i] = getDayInWeek(keysJour[i-1]);
		arrayJourValues[i] = valuesJour[i-1];
	}

	tab[0] = arrayJourPeriode;
	tab[1] = arrayJourValues;

	console.log(tab);
	
	var chart = c3.generate({
		data: {
			xs: {
				periode: 'periode_x',
			},
			columns: tab,
			type: 'scatter'
		},
		axis: {
			x: {
				label: 'Jour de la période',
				tick: {
					fit: true
				}
			},
			y: {
				label: 'Quantité de PM10 en microg/m3',
			}
		}
	});
}

function getDayInWeek(myDate) {
	// Format : dd/mm/YYYY
	var d = new Date(myDate.split("/")[2], myDate.split("/")[1]-1, myDate.split("/")[0]);
	return d.getDay();
}

function echelleTeintes(nbElem) {
	var avancement = 255/nbElem;
	var colorTab = [];

	for (var i = 0; i < nbElem; i++) {
		colorTab[i] = "#" + "FF" + componentToHex(255-i*avancement) + "00";
		//colorTab[i] = "#" + "FF" + componentToHex(i*avancement) + "00";
		//colorTab[i] = "#" + "00" + componentToHex(i*avancement) + "FF";
	}

	console.log(colorTab);
	return colorTab;
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}