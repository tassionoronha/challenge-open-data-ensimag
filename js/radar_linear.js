import Factory from './classes/Factory.js';
import DataLoader from './classes/DataLoader.js';

function drawChart(json) {
  let dataLoader = new DataLoader(...json);

  var canvas = document.getElementById('multiradar').getContext('2d');

  var argsChart = {
    year:2007,
    month: 1,
    begin: "2013-01-01",
    end: "2013-01-08",
    canvas:canvas,
    station: 0,
    type: 0,
    state: []
  };
  $("#dateBegin").val(argsChart.begin);
  $("#dateEnd").val(argsChart.end);

  var chart = new Factory('radar', argsChart, dataLoader).chart.generateChart();

  showErrors(chart);
  getStations(chart);
  getMax(chart);
  $("#month").bind("change paste keyup", function() {
    clearChart(canvas, chart);
    chart.setMonth(this.value);
    showErrors(chart);
  });
  $("#year").bind("change paste keyup", function() {
    clearChart(canvas, chart);
    chart.setYear(this.value);
    showErrors(chart);
  });

  $("#max").bind("change paste keyup", function() {
    clearChart(canvas, chart);
    chart.setFilterMax(this.value);
    showErrors(chart);
  });
  $("#dateBegin").bind("change paste keyup", function() {
    clearChart(canvas, chart);
    chart.setBegin(this.value);
    showErrors(chart);
  });
  $("#dateEnd").bind("change paste keyup", function() {
    clearChart(canvas, chart);
    chart.setEnd(this.value);
    showErrors(chart);
  });

  $("#type").bind("change", function() {
    clearChart(canvas, chart);
    chart.setType(this.value);
    $("#yearPanel").hide();
    $("#stations").hide();
    $("#monthPanel").hide();
    $("#datesPanel").hide();
    if (this.value == 0) {
      $("#yearPanel").show();
    } else if (this.value == 1) {
      $("#stations").show();
    } else if (this.value == 2) {
      $("#stations").show();
      $("#yearPanel").show();
    } else if (this.value == 3) {
      $("#yearPanel").show();
      $("#monthPanel").show();
    } else {
      $("#datesPanel").show();
      $("#stations").show();
    }
    chart.redraw();
    showErrors(chart);
    getMax(chart);
  });

  $("#stations").change(function() {
    clearChart(canvas, chart);
    chart.setStation($("#stations").find(":selected").val());
    showErrors(chart);
  });

  $("#graph").change(function() {
    clearChart(canvas, chart);
    argsChart = {
      canvas: canvas,
      year: $("#year").val(),
      month: $("#month").val(),
      begin: $("#dateBegin").val(),
      end: $("#dateEnd").val(),
      station: $("#stations").find(":selected").val(),
      type: $("#type").find(":selected").val(),
      state: chart.state
    };
    if (this.checked){
      chart = new Factory('line', argsChart, dataLoader).chart.generateChart();

    }else{
      chart = new Factory('radar', argsChart, dataLoader).chart.generateChart();
    }
    getMax(chart);
  });
  $("#resetFilters").click(function() {
    clearChart(canvas, chart);
    chart.resetFilters();
    getMax(chart);
    $("#year").val(chart.year);
    $("#month").val(chart.month+1);
    $("#stations").val(chart.station);
  });
  $("#colorChoice").change(function(){
    clearChart(canvas, chart);
    chart.changeColor();
  });
  $("#invertColors").click(function(){
    clearChart(canvas, chart);
    chart.invertColor();
  });
}

loadAll([
  "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment-with-locales.min.js",
  "js/colors.js",
  "js/Functions.js"
], [
  "datas/monthlyDatas2007.json",
  "datas/dailyDatas2007.json",
  "datas/hourlyDatas2013.json"
], function(err, json){
  if (err) {
    console.log("Failed to load: " + files);
    return;
  }
  moment.locale('fr');
  drawChart(json);
});
