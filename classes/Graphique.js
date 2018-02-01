class Graphique {
  constructor() {
    this.htmlFormat = "YYYY-MM-DD";
    this.dataFormat = "DD/MM/YYYY";
    this.color = new Color();
  }

  getRGBColor(color) {
    return color.r + "," + color.g + "," + color.b;
  }

  getColorScale(nbColors, RGB){
    return this.color.echelleTeintes(nbColors, false);
  }

  getMonthLabels(){
    let labels = [];
    for (let i = 0; i < 12; ++i) {
      let date = moment([2018, i]);
      labels[i] = capitalizeFirstLetter(date.format("MMMM"));
    }
    return labels;
  }

  getDailyLabelsForMonth(year, month){
    let date = moment([+year, +month]);
    date = date.add(1,'months').subtract(1, 'days');
    let lastDay = date.date();
    let labels = [];
    for (let i = 1; i < lastDay+1; ++i) {
      labels[i-1] = i;
    }
    return labels;
  }
  getHourlyLabels(){
    let labels = [];
    for (let i  = 0; i < 24; ++i) {
      labels[i] = pad(i, 2);
    }
    return labels;
  }
  getDailyLabels(){
    let labels = [];
    for (let i = 1; i < 32; ++i) {
      labels[i-1] = i;
    }
    return labels;
  }
}

export default Graphique;
