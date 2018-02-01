class DataLoader {
  constructor(month, day, hour){
    this.monthData = month;
    this.dayData = day;
    this.hourData = hour;
    this.dayMax = this._findMaxValue(this.dayData);
    this.monthMax = this._findMaxValue(this.monthData);
    this.hourMax = this._findMaxValue(this.dayData);
  }
  getHourMaxValue(){
    return this.hourMax;
  }
  getDayMaxValue(){
    return this.dayMax;
  }
  getMonthMaxValue(){
    return this.monthMax;
  }
  //Return the biggest number of array
  _findMaxValue(array){
    var data = [];
    for (var i = 0; i < array.length; i++) {
      let values = Object.values(array[i].data).filter(n => n != "-");
      data = data.concat(values);
    }

    return Math.max.apply(null, data);
  }
}

export default DataLoader;

