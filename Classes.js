class Graphique {
  constructor() {
    this.colors = [
      {r:38,g:142,b:22},
      {r:77,g:24,b:115},
      {r:172,g:168,b:26},
      {r:251,g:29,b:45},
      {r:27,g:59,b:114},
      {r:172,g:89,b:26}
    ];
  }

  getRGBColor(i) {
    let color = this.colors[i];
    return color.r + "," + color.g + "," + color.b;
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
    this.init = (this.year - 2007) * 12;
    this.end = this.init + 11;
    this.data = Object.values(monthlyDatas);
    this.datasets = [];
    this.state = [];
    this.chart = null;
    this.faults = [];
  }

  generateDynamicArrayMonth(){
    this.datasets = [];
    for (let j = 0; j < this.data.length; ++j) {
      let values = [];
      let currentValues = Object.values(this.data[j].data);
      for (var i = this.init; i <= this.end; i++) {
        if(currentValues[i] == "-"){
          this.faults[this.data[j].Station] = j;
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

  getFaults(){
    return this.faults;
  }

  setYear(year){
    this.year = year;
    this.init = (this.year - 2007) * 12;
    this.end = this.init + 11;
    this.generateChart();
    return this;
  }

  destroyChart(){
    this.state = [];
    for (let i = 0; i < this.chart.data.datasets.length; ++i) {
      this.state[i] = this.chart.getDatasetMeta(i).hidden;
    }
    this.chart.destroy();
    this.faults = [];
    this.datasets = [];
    return this;
  }

  generateChart(){
    this.generateDynamicArrayMonth();
    this.chart = new Chart(this.objHTML, {
      type: 'radar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: this.datasets
      },
      options: {
        scale: {
            ticks: {
                beginAtZero: true
            }
        }
      }
    });
    if (this.state.length == this.data.length) {
      for(let i = 0; i < this.state.length; ++i) {
        this.chart.getDatasetMeta(i).hidden = this.state[i];
      }
    }
    this.chart.update();

    return this;
  }
}
