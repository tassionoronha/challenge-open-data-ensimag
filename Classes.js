class Graphique {
  constructor() {
    this.colors = [
      {r:38,g:142,b:22},
      {r:77,g:24,b:115},
      {r:172,g:168,b:26},
      {r:251,g:29,b:45},
      {r:27,g:59,b:114},
      {r:172,g:89,b:26},
      {r:221,g:27,b:122},
      {r:255,g:139,b:31},
      {r:57,g:174,b:190},
      {r:176,g:242,b:70},
      {r:255,g:244,b:0},
      {r:29,g:230,b:110},
    ];
    this.beginYear = 2007;
    this.endYear = 2018;
  }

  getRGBColor(i) {
    let color = this.colors[i%this.colors.length];
    return color.r + "," + color.g + "," + color.b;
  }
}


class Factory{
  constructor(type, args){
    if(this.validateArgs(type, args)){

      switch (type) {
        case 'radar':
          this.chart = new MultiRadar(args.year,args.canvas);
          break;

        case 'lignes':
         this.chart = new MultiLignes(args.canvas);
          break;
        default:
          throw "Bad type!";
      }
    }

    return this;
  }

  getChart(){
    return this.chart;
  }

  validateArgs(type, args){
    switch (type) {
      case 'radar':
        if(args.year < 2007 && args.year > 2017){
          throw "Bad year!";
          return false;
        }
        break;
    }

    if(typeof(args.canvas) != "object"){
      throw "Bad canvas!";
      return false;
    }

    return true;
  }
}

class MultiLignes extends Graphique {
  constructor(objHTML){
    super();
    this.objHTML = objHTML;
    this.keys = Object.keys(monthlyDatas[0].data);
    this.values = Object.values(monthlyDatas);
    this.datasets = [];
    this.faults = [];
    for (let i = 0; i < this.values.length; ++i) {
      let current = {
        label: this.values[i].Station,
        data: Object.values(this.values[i].data),
        borderColor: "rgb(" + super.getRGBColor(i) + ")",
        backgroundColor: "rgba(" + super.getRGBColor(i) + ",0.1)",
      };
      this.datasets[i] = current;
    }
    this.chart = null;
  }

  generateChart(){
    this.chart = new Chart(this.objHTML, {
      type: 'line',
      data: {
        labels: this.keys,
        datasets: this.datasets
      }
    });
  }

}

class MultiRadar extends Graphique {
  constructor(year, objHTML){
    super();
    this.year = year;
    this.objHTML = objHTML;
    this.init = (this.year - this.beginYear) * 12;
    this.end = this.init + 11;
    this.data = Object.values(monthlyDatas);
    this.datasets = [];
    this.state = [];
    this.chart = null;
    this.faults = [];
    this.type = 0;
    this.station = 0;
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
      let current = {
        label: this.data[j].Station,
        data: values,
        borderColor: "rgb(" + super.getRGBColor(j) + ")",
        backgroundColor: "rgba(" + super.getRGBColor(j) + ",0.2)",
      };
      this.datasets[j] = current;
    }
  }

  generateDynamicArrayStation(){
    this.datasets = [];
    for (let j = 0; j < this.endYear-this.beginYear; ++j) {
      let values = [];
      let currentValues = Object.values(this.data[this.station].data);
      for (var i = j*12; i <= (j+1)*12-1; ++i) {
        values[values.length] = currentValues[i];
      }
      let current = {
        label: this.beginYear+j,
        data: values,
        borderColor: "rgb(" + super.getRGBColor(j) + ")",
        backgroundColor: "rgba(" + super.getRGBColor(j) + ",0)",
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
      type: 'radar',
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
