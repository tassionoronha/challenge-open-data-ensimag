class DataLoader {
  constructor(){
    this.monthData = Object.values(monthlyDatas);
    this.dayData = Object.values(dailyDatas);
    this.hourData = Object.values(hourData);
    this.dayMax = this._findMaxValue(this.dayData);
    this.monthMax = this._findMaxValue(this.monthData);
    this.hourMax = this._findMaxValue(this.dayData);
  }
  getHourMaxValue(){
    return this.hourMax;
  }
  getDayMaxValue(){
    return this.dayMax;
  }
  getMonthMaxValue(){
    return this.monthMax;
  }
  //Return the biggest number of array
  _findMaxValue(array){
    var data = [];
    for (var i = 0; i < array.length; i++) {
      let values = Object.values(array[i].data).filter(n => n != "-");
      data = data.concat(values);
    }

    return Math.max.apply(null, data);
  }
}

function showErrors(graph){
  faults = graph.getFaults();
  if(faults.length > 0){
    $("#notifications").show();
    stringFaults = "Les données suivantes sont incomplètes : <span class='missingData'>";
    for(let i=0; i<faults.length; i++){
        i>0 ? stringFaults += `, ${faults[i].name}` : stringFaults += `${faults[i].name}`;
    }
    stringFaults += "</span>.";
    $('#notifications').html(stringFaults);
  }else{
    $("#notifications").hide();
  }
}

function getStations(graph){
  let stations = graph.dataReader.getStations();
  let select = $("#stations");
  for(let i = 0; i < stations.length; ++i) {
    let opt = '<option value="' + i + '">' + stations[i] + '</option>';
    select.append(opt);
  }
}

function getMax(graph){
  $('#max').val(graph.getMax());
}

function clearChart(canvas, chart) {
  canvas.clearRect(0, 0, 1200, 600);
  chart.destroyChart();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

moment.locale('fr');
let dataLoader =new DataLoader();
