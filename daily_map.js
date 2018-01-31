var mymap = L.map('mapid').setView([45.183510, 5.731550], 12);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);

var stationsData = []
loadJSON("stations.json", function(err, json) {
  if (err) {
    console.error("failed to load list of stations");
    return;
  }
  stationsData = json;
});

var dailyDatasMaxValue = 0.0;
var dailyDatasMinValue = Infinity;
var dailyDatasLength = dailyDatas.length;
for (var stationIdx = 0; stationIdx < dailyDatasLength; stationIdx++) {
  var values = Object.values(dailyDatas[stationIdx]["data"]);
  var valuesLength = values.length;
  for (var i = 0; i < valuesLength; i++) {
    if (values[i] !== "-") {
      if (values[i] > dailyDatasMaxValue) {
        dailyDatasMaxValue = values[i];
      }
      if (values[i] < dailyDatasMinValue) {
        dailyDatasMinValue = values[i];
      }
    }
  }
}

console.log("Min: " + dailyDatasMinValue);
console.log("Max: " + dailyDatasMaxValue);

var heat = L.heatLayer([], {
  radius: 70,
  blur: 70,
  maxZoom: 10,
  max: 1.0,

  gradient: {
    0.0: 'green',
    0.5: 'yellow',
    1.0: 'red'
  }
}).addTo(mymap);


document.getElementById("date").onchange = function(e) {
  var currentDate = new Date(e.target.value);
  heat.setLatLngs([]);
  if (currentDate instanceof Date && !isNaN(currentDate)) {
    console.log(currentDate);
    var latLng = [];
    for (var stationIdx = 0; stationIdx < dailyDatasLength; stationIdx++) {
      var name = dailyDatas[stationIdx]["Station"];
      var values = dailyDatas[stationIdx]["data"];
      var data = stationNameToCoord(name);
      if (data === null) {
        console.error("Unknown station");
        return;
      }
      var strDate = currentDate.getDate().toString().padStart(2, "0") + "/"
        + (currentDate.getMonth() + 1).toString().padStart(2, "0") + "/"
        + currentDate.getFullYear();
      console.log("date: " + strDate);
      var currentLevel = values[strDate];
      if (!currentLevel || currentLevel === "-") {
        console.warn("unknown value (ignoring)");
        continue;
      }
      var ratioLevel = (currentLevel - dailyDatasMinValue)/(dailyDatasMaxValue - dailyDatasMinValue);
      console.warn("known value " + currentLevel + " " + ratioLevel);
      // TODO dailyDatasMinValue
      data.push(ratioLevel);
      latLng.push(data);
    }
    heat.setLatLngs(latLng);
  } else {
    console.log("beurk");
  }
}
document.getElementById("date").value = "2017-01-01"

function loadJSON(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', path, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == "200") {
        callback(null, JSON.parse(xhr.responseText));
      } else {
        callback("error");
      }
    }
  };
  xhr.send(null);
}

function stationNameToCoord(name) {
  for (var i = 0; i < stationsData.length; i++) {
    if (stationsData[i]["Station"] === name) {
      return [stationsData[i]["latitude"], stationsData[i]["longitude"]];
    }
  }
  return null;
}
