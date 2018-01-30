import Graphique from './Graphique.js';

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

export default MultiLignes;
