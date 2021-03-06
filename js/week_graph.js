$(function () {
  var dureePeriode = 28;
  var dateDebutSelected = "2015-01-01";
  var dateFinSelected = "2017-12-31";
  var datas;
  var showLegende = true;
  var chart;
  var color;
  var dailyDatas = null;

  var file = "./datas/dailyDatas2007.json";
  loadAll([
    "https://d3js.org/d3.v3.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.18/c3.min.js",
    "js/colors.js"
  ], file, function(err, json){
    if (err) {
      console.log("Failed to load: " + file);
      return;
    }
    color = new Color();
    dailyDatas = json;
    document.getElementById("dateDebut").value = dateDebutSelected;
    document.getElementById("dateFin").value = dateFinSelected;
    document.getElementById("dureePeriode").value = dureePeriode;

    var stationSelector = document.getElementById("station");

    for (var i = 0; i < dailyDatas.length; i++) {
      var newOption = document.createElement("option");
      newOption.text = dailyDatas[i].Station;
      newOption.value = i;
      stationSelector.add(newOption);
    }

    datas = dailyDatas[0].data;
    runGraph();
  });

  $("#switchButton").on("click", function () {
    changePlot();
  });
  $("#station").on("change", function () {
    changeStation();
  });
  $("#intervalButton").on("click", function () {
    changeDates()
  });
  $("#colorChoice").on("change", function () {
    changeColor();
  });
  $("#reverseButton").on("click", function () {
    inverseColor();
  });
  $("#legendButton").on("click", function () {
    changeLegende();
  });

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


  function changeLegende() {
    var myButton = document.getElementById("legendButton");
    if (myButton.getAttribute("display")=="true") {
      showLegende = false;
      myButton.setAttribute("display", "false");
      chart.legend.hide();
      myButton.firstChild.data = "Afficher la légende";
    }else{
      showLegende = true;
      myButton.setAttribute("display", "true");
      myButton.firstChild.data = "Masquer la légende";
      chart.legend.show();
    }
  }

  function inverseColor() {
    color.isColorInverse = !color.isColorInverse;
    runGraph();
  }

  function changeColor() {
    runGraph();
  }

  function runGraph() {
    var myButton = document.getElementById("switchButton");
    if (myButton.getAttribute("currentPlot")=="1") {
      draw_scatter_plot_week_graph();
    }else{
      draw_linear_week_graph();
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

    // init tab mean
    var arrayMeanValues = [];
    var arrayNbDataMean = [];
    arrayMeanValues[0] = "moyenne";

    // init mean
    for (var i = 1; i <= dureePeriode; i++) {
      arrayMeanValues[i] = 0;
      arrayNbDataMean[i-1] = 0;
    }

    var debutPeriode = decalage;
    var nbTour = 0;
    var periods = [];
    while(debutPeriode<keysJour.length && getDateFromFrenchFormat(keysJour[debutPeriode]) <= dateFin) {
      nbTour++;

      tab[nbTour] = [];
      tab[nbTour][0] = "Periode "+ nbTour;
      periods[nbTour] = tab[nbTour][0];

      var possitionDansPeriode = 0;
      while(possitionDansPeriode < dureePeriode && getDateFromFrenchFormat(keysJour[debutPeriode+ possitionDansPeriode]) <= dateFin) {
        tab[nbTour][possitionDansPeriode+1] = valuesJour[debutPeriode+possitionDansPeriode];

        if (valuesJour[debutPeriode+possitionDansPeriode] != '-' && ! isNaN(valuesJour[debutPeriode+possitionDansPeriode])) {
          arrayMeanValues[possitionDansPeriode+1] = arrayMeanValues[possitionDansPeriode+1] + valuesJour[debutPeriode+possitionDansPeriode];
          arrayNbDataMean[possitionDansPeriode] = arrayNbDataMean[possitionDansPeriode]+1;
        }

        possitionDansPeriode++;
      }

      debutPeriode = debutPeriode + possitionDansPeriode;
    }

    for (var i = 1; i < arrayMeanValues.length; i++) {
      arrayMeanValues[i] = arrayMeanValues[i]/arrayNbDataMean[i-1];
    }

    tab[nbTour+1] = arrayMeanValues;

    colors = color.echelleTeintes(nbTour);
    colors[colors.length] = "#000000";

    chart = c3.generate({
      data: {
        x: 'x',
        columns: tab,
        type: 'spline'
      },
      color: {
        pattern: colors
      },
      axis: {
        x: {
          label: 'Jour dans la période',
          //position: 'outer-center',
          tick: {
            fit: true
          }
        },
        y: {
          label: {
            text: 'Quantité de PM10 en microg/m3',
            position: 'outer-middle'
          }
        }
      },
      tooltip: {
        format: {
          title: function(d) { return 'Jour ' + d},
          name: function(value, ratio, id, index) {
            if (id=="moyenne") {
              return "moyenne";
            }
            var idx = periods.indexOf(id);
            return idx + " - " + keysJour[(decalage+idx*dureePeriode+index) - dureePeriode];
          }
        }
      }
    });

    if (showLegende == false) {
      chart.legend.hide();
    }
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

    var nbPeriode = {moyenne: "moyenne_x"};

    // init all tab
    var arrayMeanValuesX = [];
    var arrayMeanValues = [];
    var arrayNbDataMean = [];

    arrayMeanValuesX[0] = "moyenne_x";
    arrayMeanValues[0] = "moyenne";

    // init mean
    for (var i = 1; i <= dureePeriode; i++) {
      arrayMeanValues[i] = 0;
      arrayMeanValuesX[i] = i-1;
      arrayNbDataMean[i-1] = 0;
    }

    var debutPeriode = decalage;
    var nbTour = 0;
    var periods = [];

    while(debutPeriode<keysJour.length && getDateFromFrenchFormat(keysJour[debutPeriode]) <= dateFin) {
      nbTour++;

      nbPeriode["periode"+nbTour] = "periode"+nbTour+"_x";

      arrayJourPeriode = [];
      arrayJourValues = [];
      arrayJourPeriode[0] = "periode"+nbTour+"_x";;
      arrayJourValues[0] = "periode"+nbTour;
      periods[nbTour] = arrayJourValues[0];

      var possitionDansPeriode = 0;
      while(possitionDansPeriode < dureePeriode && getDateFromFrenchFormat(keysJour[debutPeriode+ possitionDansPeriode]) <= dateFin) {
        arrayJourPeriode[possitionDansPeriode+1] = possitionDansPeriode;
        arrayJourValues[possitionDansPeriode+1] = valuesJour[debutPeriode+possitionDansPeriode];


        if (valuesJour[debutPeriode+possitionDansPeriode] != '-' && ! isNaN(valuesJour[debutPeriode+possitionDansPeriode])) {
          arrayMeanValues[possitionDansPeriode+1] = arrayMeanValues[possitionDansPeriode+1] + valuesJour[debutPeriode+possitionDansPeriode];
          arrayNbDataMean[possitionDansPeriode] = arrayNbDataMean[possitionDansPeriode]+1;
        }

        possitionDansPeriode++;
      }

      tab[(nbTour-1)*2] = arrayJourPeriode;
      tab[(nbTour-1)*2+1] = arrayJourValues;

      debutPeriode = debutPeriode + possitionDansPeriode;
    }

    for (var i = 1; i < arrayMeanValues.length; i++) {
      arrayMeanValues[i] = arrayMeanValues[i]/arrayNbDataMean[i-1];
    }

    tab[nbTour*2] = arrayMeanValuesX;
    tab[nbTour*2+1] = arrayMeanValues;

    colors = color.echelleTeintes(nbTour);
    colors[colors.length] = "#000000";

    // draw chart
    chart = c3.generate({
      data: {
        xs: nbPeriode,
        columns: tab,
        type: 'scatter',
        types: {
          moyenne: 'spline',
        }
      },
      color: {
        pattern: colors
      },
      axis: {
        x: {
          label: 'Jour dans la période',
          tick: {
            fit: true
          }
        },
        y: {
          label: {
            text: 'Quantité de PM10 en microg/m3',
            position: 'outer-middle'
          }
        }
      },
      tooltip: {
        format: {
          title: function(d) { return 'Jour ' + d},
          name: function(value, ratio, id, index) {
            if (id=="moyenne") {
              return "moyenne";
            }
            var idx = periods.indexOf(id);
            return idx + " - " + keysJour[(decalage+idx*dureePeriode+index) - dureePeriode];
          }
        }
      }
    });

    if (showLegende == false) {
      chart.legend.hide();
    }
  }

  function getDateFromFrenchFormat(myDate) {
    // Format : dd/mm/YYYY
    return new Date(myDate.split("/")[2], myDate.split("/")[1]-1, myDate.split("/")[0]);
  }

  function getDateFromUniversalFormat(myDate) {
    // Format : YYYY-mm-dd
    return new Date(myDate.split("-")[0], myDate.split("-")[1]-1, myDate.split("-")[2]);
  }
});
