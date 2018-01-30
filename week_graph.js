/* TODO :
- Faire la même chose pour les années ?
- Faire la courbe moyenne pour le scatter plot 
- Régler la taille de l'affichage
- indiquer la date au survol
- faire un décalage du scatter plot pour que le 0 et la légende ne fussionnent pas
*/
var dureePeriode = 7;
var dateDebutSelected = "2016-01-01";
var dateFinSelected = "2016-12-31";
var datas;

window.onload = initData;

function initData() {
	document.getElementById("dateDebut").value = dateDebutSelected;
	document.getElementById("dateFin").value = dateFinSelected;
	document.getElementById("dureePeriode").value = dureePeriode;

	console.log(dailyDatas);

	var stationSelector = document.getElementById("station");

	for (var i = 0; i < dailyDatas.length; i++) {
		var newOption = document.createElement("option");
		newOption.text = dailyDatas[i].Station;
		newOption.value = i;
		stationSelector.add(newOption);
	}

	datas = dailyDatas[0].data;
	draw_linear_week_graph();
	//draw_scatter_plot_week_graph();
}

function changePlot() {
	var myButton = document.getElementById("switchButton");

	if (myButton.getAttribute("currentPlot")=="1") {
		myButton.setAttribute("currentPlot", "0");
	}else{
		myButton.setAttribute("currentPlot", "1");
	}

	runGraph();
}

function changeStation() {
	var indice = document.getElementById("station").value;
	datas = dailyDatas[indice].data;
	runGraph();
}

function changeDates() {
	dateDebutSelected = document.getElementById("dateDebut").value;
	dateFinSelected = document.getElementById("dateFin").value;
	dureePeriode = document.getElementById("dureePeriode").value;	
	runGraph();
}

function runGraph() {
	var myButton = document.getElementById("switchButton");
	if (myButton.getAttribute("currentPlot")=="1") {
		draw_linear_week_graph();
	}else{
		draw_scatter_plot_week_graph();
	}
}

function draw_linear_week_graph() {
	tab = [];
	tab[0] = [];
	tab[0][0] = 'x';

	for (var i = 0; i < dureePeriode; i++) {
		tab[0][i+1] = i;
	}

	var decalage = 0;

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
	tab = [];

	var decalage = 0;

	var keysJour = Object.keys(datas);
	var valuesJour = Object.values(datas);

	var dateDebut = getDateFromUniversalFormat(dateDebutSelected);
	var dateFin = getDateFromUniversalFormat(dateFinSelected);

	// find beginning of the chart
	while(getDateFromFrenchFormat(keysJour[decalage]) < dateDebut){
		decalage++;
	}

	// init all tab
	arrayJourPeriode = [];
	arrayJourValues = [];
	arrayMeanValuesX = [];
	arrayMeanValues = [];

	arrayNbDataMean = [];

	arrayJourPeriode[0] = "periode_x";
	arrayJourValues[0] = "periode";
	arrayMeanValuesX[0] = "moyenne_x";
	arrayMeanValues[0] = "moyenne";

	// init mean
	for (var i = 1; i <= dureePeriode; i++) {
		arrayMeanValues[i] = 0;
		arrayMeanValuesX[i] = i-1;
		arrayNbDataMean[i-1] = 0;
	}

	var positionAbsolue = decalage;
	var positionTableau = 1;
	while(positionAbsolue<keysJour.length && getDateFromFrenchFormat(keysJour[positionAbsolue]) <= dateFin){
		var dayInPeriode = (positionTableau-1)%dureePeriode;
		arrayJourPeriode[positionTableau] = dayInPeriode;
		arrayJourValues[positionTableau] = valuesJour[positionAbsolue];

		if (valuesJour[positionAbsolue] != '-') {
			arrayMeanValues[dayInPeriode+1] = arrayMeanValues[dayInPeriode+1] + valuesJour[positionAbsolue];
			arrayNbDataMean[dayInPeriode] = arrayNbDataMean[dayInPeriode]+1;
		}		

		console.log(arrayMeanValues[dayInPeriode+1] + valuesJour[positionAbsolue]);

		positionTableau++;
		positionAbsolue++;
	}

	for (var i = 1; i < arrayMeanValues.length; i++) {
		arrayMeanValues[i] = arrayMeanValues[i]/arrayNbDataMean[i-1];
	}

	tab[0] = arrayJourPeriode;
	tab[1] = arrayJourValues;
	tab[2] = arrayMeanValuesX;
	tab[3] = arrayMeanValues;

	console.log(tab);
	
	// draw chart
	var chart = c3.generate({
		data: {
			xs: {
				periode: 'periode_x',
				moyenne: 'moyenne_x',
			},
			columns: tab,
			type: 'scatter',
			types: {
				moyenne: 'line',
			}
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