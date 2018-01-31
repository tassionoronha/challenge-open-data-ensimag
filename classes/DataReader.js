class DataReader {
  constructor(){
    this.monthData = Object.values(monthlyDatas);
    this.dayData = Object.values(dailyDatas);
    this.beginYear = 2007;
    this.endYear = 2018;
    this.faults = [];
    this.maxValue = -1;
  }
  getDuration(){
    return this.endYear-this.beginYear;
  }
  getMonthsByYearAndStation(year, station){
    this.maxValue = this._findMaxValue(this.dayData);
    let res = [];
    let dates = Object.keys(this.dayData[0].data);
    let init = this._getDailyInitIndex(dates, year);
    var currentDay = 0;
    let currentValues = Object.values(this.dayData[station].data);
    for (var i = 0; i < 12; i++) {
      let values = [];
      let date = moment(dates[init + currentDay], 'DD/MM/YYYY');
      while(i == date.month()) {
        ++currentDay;
        let val = currentValues[init + currentDay];
        if(val == "-"){
          let fault = {name: date.format("MMMM"), index: i};
          this.addFault(fault);
        }
        date = moment(dates[init + currentDay], 'DD/MM/YYYY');
        values[values.length] = val;
      }
      res[i] = values;
    }
    return res;
  }
  getYearsByStation(station){
    this.maxValue = this._findMaxValue(this.monthData);
    let res = [];
    for (let j = 0; j < this.endYear-this.beginYear; ++j) {
      let values = [];
      let currentValues = Object.values(this.monthData[station].data);
      for (var i = j*12; i <= (j+1)*12-1; ++i) {
        if(currentValues[i] == "-"){
          let fault = {name: this.beginYear+j, index: j};
          this.addFault(fault);
        }
        values[values.length] = currentValues[i];
      }
      res[j] = values;
    }
    return res;
  }
  getStationsByYear(year){
    this.maxValue = this._findMaxValue(this.monthData);
    let res = [];
    let init = (year - this.beginYear) * 12;
    let end = init + 11;
    for (let j = 0; j < this.monthData.length; ++j) {
      let values = [];
      let currentValues = Object.values(this.monthData[j].data);
      for (var i = init; i <= end; i++) {
        if(currentValues[i] == "-"){
          let fault = {name: this.monthData[j].Station, index: j};
          this.addFault(fault);
        }
        values[values.length] = currentValues[i];
      }
      res[j] = values;
    }
    return res;
  }
  getStations(){
    let stations = [];
    for (let i = 0; i < this.monthData.length; ++i) {
      stations[i] = this.monthData[i].Station;
    }
    return stations;
  }
  getFaults(){
    return this.faults;
  }
  getMax(){
    return this.maxValue;
  }

  addFault(fault){
    var exists = false;
    for (var i = 0; i < this.faults.length; i++) {
      if(this.faults[i].index == fault.index){ exists = true;break; }
    }
    if(!exists){this.faults.push(fault)}
  }
  cleanFaults(){
    this.faults = [];
  }
  _getDailyInitIndex(dates, year){
    let init = -1;
    for (let i = 0; i < dates.length; ++i) {
      let date = moment(dates[i], "DD/MM/YYYY");
      if(init == -1 && date.year() == year) {
        init = i;
        break;
      }
    }
    return init;
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

export default DataReader;

