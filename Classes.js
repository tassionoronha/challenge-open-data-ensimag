class Radar{
  constructor(year, objHTML){
    this.year = year;
    this.objHTML = objHTML;
    this.init = (this.year - 2010) * 12;
    this.end = this.init + 11;
    this.data = Object.values(dataMonth[0].data);
    this.values = [];
    this.chart = null;
  }

  generateDynamicArrayMonth(){
    for (var i = this.init; i <= this.end; i++) {
      this.values[i] = this.data[i];
    }
  }

  setYear(year){
    this.year = year;
    return this;
  }

  destroyChart(){
    this.values = [];
    return this;
  }

  generateChart(){
    this.generateDynamicArrayMonth();
    this.chart = new Chart(this.objHTML, {
      type: 'radar',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: 'Grenoble Pollution',
          backgroundColor: "rgba(153,255,51,0.4)",
          borderColor: "rgba(153,255,51,1)",
          data: this.values
        }]
      }
    });

    return this;
  }
}

class Lignes{

  constructor(objHTML){
    this.objHTML = objHTML;
    this.keys = Object.keys(dataChart[0].data);
    this.values = Object.values(dataChart[0].data);
    this.chart = null;
  }

  generateChart(){
    this.chart = new Chart(this.objHTML, {
      type: 'line',
      data: {
        labels: this.keys,
        datasets: [{
          label: 'Pollution',
          data: this.values,
          backgroundColor: "rgba(153,255,51,0.4)"
        }]
      }
    });
  }


}
