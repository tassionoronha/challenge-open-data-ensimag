$(function () {
  loadJSON(["stations.json", "dailyDatas2007.json"], function (err, jsons) {
    if (err) {
      // TODO error on page
      console.error(err);
      console.error("failed to load the json data");
      return;
    }
    var stationsJson = jsons[0];
    var dataJson = jsons[1];
    var interval = minMaxValueFromData(dataJson);

    var mymap = L.map("mapid").setView([45.183510, 5.731550], 12);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(mymap);

    /*var heatLayer = L.heatLayer([], {
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

    $("#date").on('change', function () {
      var date = new Date(this.value);
      if (!(date instanceof Date) || isNaN(date)) {
        console.warn("invalid date (" + this.value + ")");
        heatLayer.setLatLngs([]);
        return;
      }
      var latLngVals = dataJson.map(function (x) {
        var coord = stationNameToCoord(stationsJson, x["Station"]);
        if (!coord) {
          // TODO error on page ?
          console.warn("missing coordinates for " + x["Station"]);
          return;
        }
        var val = x["data"][formatDate(date)];
        if (!val || val === "-") {
          // TODO error on page
          console.warn("unknown level for " x["Station"] + " on " + formatDate(date));
          return;
        }
        return coord.concat(val);
      }).filter(x => x !== undefined);
      heatLayer.setLatLngs(latLngVals);
    });*/

  });

  function minMaxValueFromData(data) {
    data = data.map(x => Object.values(x["data"]).filter(v => v !== "-"));
    var min = Math.min.apply(null, data.map(x => Math.min.apply(null, x)));
    var max = Math.max.apply(null, data.map(x => Math.max.apply(null, x)));
    return [min, max];
  }
  function formatDate(date) {
    return date.getDate().toString().padStart(2, "0") + "/"
      + (date.getMonth() + 1).toString().padStart(2, "0") + "/"
      + date.getFullYear();
  }
  function stationNameToCoord(stations, name) {
    var v = stations.filter(x => x["Station"] === name);
    if (v.length === 0) {
      return null;
    }
    return [v[0]["latitude"], v[0]["longitude"]];
  }

  /*class Player{
    constructor(){
      this.stopped = true;
      this.current = 0;
      this.htmlFormat = "YYYY-MM-DD";
      this.dataFormat = "DD/MM/YYYY";
    }
    stop() {
      this.stopped = true;
    }
    async play() {
      this.stopped = false;
      let dates = Object.keys(dailyDatas[0].data);
      let ev = new Event("change");
      let input = document.getElementById("date");
      let selected = moment(input.value, this.htmlFormat).format(this.dataFormat);
      for (this.current = dates.indexOf(selected); this.current < dates.length; ++this.current) {
        let value = moment(dates[this.current], this.dataFormat);
        input.value = value.format(this.htmlFormat);
        input.dispatchEvent(ev);
        if (this.stopped) break;
        await this._sleep(400);
      }
    }
    _sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  let player = new Player();
*/
});
