/* TODO :
- Choisir la durée d'une période (pour l'instant, c'est 7 jour)
- Choisir la date de début et la date de fin
- Faire en sorte d'afficher toutes les données dans l'interval (et pas juste les semaines complètes)
- Faire la même chose pour les années ?
- Faire la courbe moyenne pour le scatter plot 
*/
var dureePeriode = 7;
var dateDebutSelected = "2016-01-01";
var dateFinSelected = "2016-12-31";
var allDatas;
//var dataFile = "datas/data_boulevard_all_2016.json";

window.onload = initData;

function initData() {
	document.getElementById("dateDebut").value = dateDebutSelected;
	document.getElementById("dateFin").value = dateFinSelected;
	document.getElementById("dureePeriode").value = dureePeriode;

	allDatas = dailyDatas;
	draw_linear_week_graph();
}

function changePlot() {
	var myButton = document.getElementById("switchButton");

	if (myButton.getAttribute("currentPlot")=="1") {
		draw_scatter_plot_week_graph();
		myButton.setAttribute("currentPlot", "0");
	}else{
		draw_linear_week_graph();
		myButton.setAttribute("currentPlot", "1");
	}
}

function changeDates() {
	dateDebutSelected = document.getElementById("dateDebut").value;
	dateFinSelected = document.getElementById("dateFin").value;
	dureePeriode = document.getElementById("dureePeriode").value;
	var myButton = document.getElementById("switchButton");
	
	console.log(myButton.getAttribute("currentPlot")=="1")
	if (myButton.getAttribute("currentPlot")=="1") {
		draw_linear_week_graph();
	}else{
		draw_scatter_plot_week_graph();
	}
}

function draw_linear_week_graph() {
	console.log(allDatas);

	tab = [];
	tab[0] = [];
	tab[0][0] = 'x';

	for (var i = 0; i < dureePeriode; i++) {
		tab[0][i+1] = i;
	}

	var decalage = 0;

	datas = allDatas[0].data;
	var keysJour = Object.keys(datas);
	var valuesJour = Object.values(datas);

	var dateDebut = getDateFromUniversalFormat(dateDebutSelected);
	var dateFin = getDateFromUniversalFormat(dateFinSelected);

	while(getDateFromFrenchFormat(keysJour[decalage]) < dateDebut){
		decalage++;
	}

	var debutPeriode = decalage;
	var nbTour = 0;
	while(debutPeriode<keysJour.length && getDateFromFrenchFormat(keysJour[debutPeriode]) <= dateFin) {
		nbTour++;

		tab[nbTour] = [];
		tab[nbTour][0] = "periode "+nbTour;
		
		var possitionDansPeriode = 0;
		while(possitionDansPeriode < dureePeriode) {
			if (debutPeriode+possitionDansPeriode<keysJour.length && getDateFromFrenchFormat(keysJour[debutPeriode+possitionDansPeriode]) <= dateFin) {
				tab[nbTour][possitionDansPeriode+1] = valuesJour[debutPeriode+possitionDansPeriode];
			}else{
				tab[nbTour][possitionDansPeriode+1] = '-';
			}

			possitionDansPeriode++;
		}
		
		debutPeriode = debutPeriode + possitionDansPeriode;
	}

	console.log("nbTour: "+nbTour);

	console.log(tab);

	var chart = c3.generate({
		data: {
			x: 'x',
			columns: tab
		},
		color: {
			pattern: echelleTeintes(nbTour)
		}
	});
}


function draw_scatter_plot_week_graph() {
	//var allDatas = JSON.parse(jsonData);
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

function getDateFromFrenchFormat(myDate) {
	// Format : dd/mm/YYYY
	return new Date(myDate.split("/")[2], myDate.split("/")[1]-1, myDate.split("/")[0]);
}

function getDateFromUniversalFormat(myDate) {
	// Format : YYYY-mm-dd
	return new Date(myDate.split("-")[0], myDate.split("-")[1]-1, myDate.split("-")[2]);
}

function getDayInWeek(myDate) {
	// Format : dd/mm/YYYY
	var d = new Date(myDate.split("/")[2], myDate.split("/")[1]-1, myDate.split("/")[0]);
	return d.getDay();
}

function echelleTeintes(nbElem) {
	var avancement = Math.floor(255/nbElem);
	var colorTab = [];

	for (var i = 0; i < nbElem; i++) {
		colorTab[i] = "#" + "FF" + componentToHex(255-(i+1)*avancement) + "00";
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