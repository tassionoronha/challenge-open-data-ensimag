import Graphique from './Graphique.js';

class MultiGraph extends Graphique {
  constructor(graph, args){
    super();
    this.year = args.year;
    this.graph = graph;
    this.objHTML = args.canvas;
    this.init = (this.year - this.beginYear) * 12;
    this.end = this.init + 11;
    this.data = Object.values(monthlyDatas);
    this.datasets = [];
    this.state = [];
    this.chart = null;
    this.faults = [];
    this.type = args.type;
    this.station = args.station;
  }

  addFault(fault){
    var exists = false;
    for (var i = 0; i < this.faults.length; i++) {
      if(this.faults[i].index == fault.index){ exists = true }
    }
    if(!exists && !this.state[fault.index]){this.faults.push(fault)}
  }

  generateDynamicArrayMonth(){
    this.datasets = [];
    let colors = super.getColorScale(this.data.length, 1);
    for (let j = 0; j < this.data.length; ++j) {
      let values = [];
      let currentValues = Object.values(this.data[j].data);
      for (var i = this.init; i <= this.end; i++) {
        if(currentValues[i] == "-"){
          let fault = {station: this.data[j].Station, index: j};
          this.addFault(fault);
        }
        values[values.length] = currentValues[i];
      }
      let color = super.getRGBColor(colors[j]);
      let current = {
        label: this.data[j].Station,
        data: values,
        borderColor: "rgb(" + color + ")",
        backgroundColor: "rgba(" + color + ",0.1)",
      };
      this.datasets[j] = current;
    }
  }

  generateDynamicArrayStation(){
    this.datasets = [];
    let colors = super.getColorScale(this.endYear-this.beginYear, 1);
    for (let j = 0; j < this.endYear-this.beginYear; ++j) {
      let values = [];
      let currentValues = Object.values(this.data[this.station].data);
      for (var i = j*12; i <= (j+1)*12-1; ++i) {
        values[values.length] = currentValues[i];
      }
      let color = super.getRGBColor(colors[j]);
      let current = {
        label: this.beginYear+j,
        data: values,
        borderColor: "rgb(" + color + ")",
        backgroundColor: "rgba(" + color + ",0)",
      };
      this.datasets[j] = current;
    }
  }

  getFaults(){
    return this.faults;
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
    this.init = (this.year - this.beginYear) * 12;
    this.end = this.init + 11;
    this.generateChart();
    return this;
  }

  destroyChart(){
    this.state = [];
    let max;
    if (this.type == 0)
      max = this.chart.data.datasets.length;
    else
      max = this.endYear - this.beginYear;
    for (let i = 0; i < max; ++i) {
      this.state[i] = this.chart.getDatasetMeta(i).hidden;
    }
    this.chart.destroy();
    this.faults = [];
    this.datasets = [];
    return this;
  }

  generateChart(){
    if (this.type == 0) {
      this.generateDynamicArrayMonth();
    } else {
      this.generateDynamicArrayStation();
    }
    this.chart = new Chart(this.objHTML, {
      type: this.graph,
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: this.datasets
      },
      options: {
        maintainAspectRatio: false,
        scale: {
          ticks: {
              beginAtZero: true
          }
        },
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
    });
    if (this.state.length > 0) {
      for(let i = 0; i < this.state.length; ++i) {
        this.chart.getDatasetMeta(i).hidden = this.state[i];
      }
    }
    this.chart.update();

    return this;
  }
}

export default MultiGraph;
