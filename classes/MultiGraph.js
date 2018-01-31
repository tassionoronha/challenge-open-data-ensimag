import Graphique from './Graphique.js';
import DataReader from './DataReader.js';

class MultiGraph extends Graphique {
  constructor(graph, args){
    super();
    this.dataReader = new DataReader();
    this.year = args.year;
    this.graph = graph;
    this.objHTML = args.canvas;
    this.type = args.type;
    this.datasets = [];
    this.state = args.state;
    this.chart = null;
    this.station = args.station;
    this.labels = [];
    this.max = null;
  }

  createDataset(label, values, color, opacity) {
    return {
      label: label,
      data: values,
      borderColor: "rgb(" + color + ")",
      backgroundColor: "rgba(" + color + "," + opacity + ")",
    };
  }

  generateGraphDays(){
    this.labels = this.getDailyLabels();
    this.datasets = [];

    let labels = this.getMonthLabels();
    let colors = super.getColorScale(12, 1);
    let values = this.dataReader.getMonthsByYearAndStation(this.year, this.station);
    for (var i = 0; i < 12; i++) {
      let color = super.getRGBColor(colors[i]);
      this.datasets[i] = this.createDataset(labels[i],values[i],color,0);
    }
  }
  generateGraphMonth(){
    this.labels = this.getMonthLabels();
    this.datasets = [];
    let stations = this.dataReader.getStations();
    let values = this.dataReader.getStationsByYear(this.year);
    let colors = super.getColorScale(stations.length, 1);
    for (let j = 0; j < stations.length; ++j) {
      let color = super.getRGBColor(colors[j]);
      this.datasets[j] = this.createDataset(stations[j],values[j],color,0.1);
    }
  }

  generateGraphStation(){
    this.labels = this.getMonthLabels();
    this.datasets = [];
    let duration = this.dataReader.getDuration();
    let colors = super.getColorScale(duration, 1);
    let values = this.dataReader.getYearsByStation(this.station);
    for (let j = 0; j < duration; ++j) {
      let color = super.getRGBColor(colors[j]);
      this.datasets[j] = this.createDataset(this.dataReader.beginYear+j,values[j],color,0);
    }
  }

  setType(type){
    this.type = type;
    this.state = [];
  }
  setStation(station){
    this.station = station;
    this.generateChart();
    return this;
  }

  setYear(year){
    this.year = year;
    this.init = (this.year - this.dataReader.beginYear) * 12;
    this.end = this.init + 11;
    this.generateChart();
    return this;
  }
  redraw(){
    this.generateChart();
    return this;
  }

  destroyChart(){
    this.state = [];
    let max = this.chart.data.datasets.length;
    for (let i = 0; i < max; ++i) {
      this.state[i] = this.chart.getDatasetMeta(i).hidden;
    }
    this.chart.destroy();
    this.dataReader.cleanFaults();
    this.datasets = [];
    return this;
  }

  getOptions(type){
    var options = {
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 40
        }
      },
      elements: {
        line: {
          tension: 0
        }
      }
    }

    switch (type) {
        case 'line':
          options.scales = {
            yAxes:[{
              ticks: {
                  beginAtZero: true,
                  max: this.max
              }
            }]
          };
          break;
        case 'radar':
          options.scale = {
              ticks: {
                  beginAtZero: true,
                  max: this.max
              }
          };
          break;
        default:
          throw "Bad type!";
    }
    return options;
  }

  generateChart(){
    if (this.type == 0) {
      this.generateGraphMonth();
    } else if (this.type == 1) {
      this.generateGraphStation();
    } else {
      this.generateGraphDays();
    }
    this.max = this.dataReader.getMax();
    this.chart = new Chart(this.objHTML, {
      type: this.graph,
      data: {
        labels: this.labels,
        datasets: this.datasets
      },
      options: this.getOptions(this.graph)
    });
    if (this.state.length > 0) {
      for(let i = 0; i < this.state.length; ++i) {
        this.chart.getDatasetMeta(i).hidden = this.state[i];
      }
    }
    this.chart.update();

    return this;
  }
  getFaults(){
    let faults = this.dataReader.getFaults();
    for(let i = 0; i < faults.length; ++i) {
      if(this.state[faults[i].index])
        faults.splice(i, 1);
    }
    return faults;
  }
}

export default MultiGraph;
