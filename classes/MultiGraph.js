import Graphique from './Graphique.js';

class MultiGraph extends Graphique {
  constructor(graph, args){
    super();
    this.year = args.year;
    this.graph = graph;
    this.objHTML = args.canvas;
    this.init = (this.year - this.beginYear) * 12;
    this.end = this.init + 11;
    this.type = args.type;
    this.monthData = Object.values(monthlyDatas);
    this.dayData = Object.values(dailyDatas);
    this.datasets = [];
    this.state = [];
    this.chart = null;
    this.faults = [];
    this.station = args.station;
    this.labels = [];
  }

  addFault(fault){
    var exists = false;
    for (var i = 0; i < this.faults.length; i++) {
      if(this.faults[i].index == fault.index){ exists = true }
    }
    if(!exists && !this.state[fault.index]){this.faults.push(fault)}
  }

  generateDynamicArrayDays(){
    this.labels = this.getDailyLabels();
    this.datasets = [];
    let init = -1;
    let end = -1;
    let dates = Object.keys(this.dayData[0].data);
    for (let i = 0; i < dates.length; ++i) {
      let date = moment(dates[i], "DD/MM/YYYY");
      if(init == -1 && date.year() == this.year) {
        init = i;
      }
      if(date.year() == (+this.year)+1) {
        end = i-1;
        break;
      }
    }
    if (end == -1) {
      end = dates.length;
    }

    let labels = this.getMonthLabels();
    let colors = super.getColorScale(12, 1);
    let values = [];
    var currentDay = 0;
    let currentValues = Object.values(this.dayData[this.station].data);
    for (var i = 0; i < 12; i++) {
      let values = [];
      while(i == moment(dates[init + currentDay], 'DD/MM/YYYY').month()) {
        ++currentDay;
        values[values.length] = currentValues[init + currentDay];
      }
      let color = super.getRGBColor(colors[i]);
      let current = {
        label: labels[i],
        data: values,
        borderColor: "rgb(" + color + ")",
        backgroundColor: "rgba(" + color + ",0)",
      };
      this.datasets[i] = current;
    }
  }
  generateDynamicArrayMonth(){
    this.labels = this.getMonthLabels();
    this.datasets = [];
    let colors = super.getColorScale(this.monthData.length, 1);
    for (let j = 0; j < this.monthData.length; ++j) {
      let values = [];
      let currentValues = Object.values(this.monthData[j].data);
      for (var i = this.init; i <= this.end; i++) {
        if(currentValues[i] == "-"){
          let fault = {station: this.monthData[j].Station, index: j};
          this.addFault(fault);
        }
        values[values.length] = currentValues[i];
      }
      let color = super.getRGBColor(colors[j]);
      let current = {
        label: this.monthData[j].Station,
        data: values,
        borderColor: "rgb(" + color + ")",
        backgroundColor: "rgba(" + color + ",0.1)",
      };
      this.datasets[j] = current;
    }
  }

  generateDynamicArrayStation(){
    this.labels = this.getMonthLabels();
    this.datasets = [];
    let colors = super.getColorScale(this.endYear-this.beginYear, 1);
    for (let j = 0; j < this.endYear-this.beginYear; ++j) {
      let values = [];
      let currentValues = Object.values(this.monthData[this.station].data);
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
  redraw(){
    this.generateChart();
    return this;
  }

  destroyChart(){
    this.state = [];
    if (this.type == 1) {
      let max;
      if (this.type == 0)
        max = this.chart.data.datasets.length;
      else
        max = this.endYear - this.beginYear;
      for (let i = 0; i < max; ++i) {
        this.state[i] = this.chart.getDatasetMeta(i).hidden;
      }
    }
    this.chart.destroy();
    this.faults = [];
    this.datasets = [];
    return this;
  }

  getMonthLabels(){
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }

  getDailyLabels(){
    let labels = [];
    for (let i = 1; i < 32; ++i) {
      labels[i-1] = "" + i;
    }
    return labels;
  }

  generateChart(){
    if (this.type == 0) {
      this.generateDynamicArrayMonth();
    } else if (this.type == 1) {
      this.generateDynamicArrayStation();
    } else {
      this.generateDynamicArrayDays();
    }
    this.chart = new Chart(this.objHTML, {
      type: this.graph,
      data: {
        labels: this.labels,
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
