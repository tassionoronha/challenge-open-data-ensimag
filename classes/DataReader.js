class DataReader {
  constructor(dataLoader){
    this.beginYear = 2007;
    this.endYear = 2018;
    this.faults = [];
    this.maxValue = -1;
    this.datas = dataLoader;
  }
  getStationsByYearAndMonth(year, month, monthLength){
    this.maxValue = this.datas.getDayMaxValue();
    let res = [];
    let stations = this.getStations();
    let dates = Object.keys(this.datas.dayData[0].data);
    let init = this._getDailyInitIndex(dates, year, month);
    var currentDay = 0;
    for (let j = 0; j < stations.length; ++j) {
      let values = [];
      let currentValues = Object.values(this.datas.dayData[j].data);
      for(let i = 0; i < monthLength; ++i) {
        let val = currentValues[init + i];
        if(val == "-"){
          let fault = {name: stations[j], index: j};
          this._addFault(fault);
        }
        values[values.length] = val;
      }
      res[j] = values;
    }
    return res;
  }
  getMonthsByYearAndStation(year, station){
    this.maxValue = this.datas.getDayMaxValue();
    let res = [];
    let dates = Object.keys(this.datas.dayData[0].data);
    let init = this._getDailyInitIndex(dates, year, 0);
    var currentDay = 0;
    let currentValues = Object.values(this.datas.dayData[station].data);
    for (var i = 0; i < 12; i++) {
      let values = [];
      let date = moment(dates[init + currentDay], 'DD/MM/YYYY');
      while(i == date.month()) {
        ++currentDay;
        let val = currentValues[init + currentDay];
        if(val == "-"){
          let fault = {name: capitalizeFirstLetter(date.format("MMMM")), index: i};
          this._addFault(fault);
        }
        date = moment(dates[init + currentDay], 'DD/MM/YYYY');
        values[values.length] = val;
      }
      res[i] = values;
    }
    return res;
  }
  getYearsByStation(station){
    this.maxValue = this.datas.getMonthMaxValue();
    let res = [];
    for (let j = 0; j < this.endYear-this.beginYear; ++j) {
      let values = [];
      let currentValues = Object.values(this.datas.monthData[station].data);
      for (var i = j*12; i <= (j+1)*12-1; ++i) {
        if(currentValues[i] == "-"){
          let fault = {name: this.beginYear+j, index: j};
          this._addFault(fault);
        }
        values[values.length] = currentValues[i];
      }
      res[j] = values;
    }
    return res;
  }
  getStationsByYear(year){
    this.maxValue = this.datas.getMonthMaxValue();
    let res = [];
    let init = (year - this.beginYear) * 12;
    let end = init + 11;
    for (let j = 0; j < this.datas.monthData.length; ++j) {
      let values = [];
      let currentValues = Object.values(this.datas.monthData[j].data);
      for (var i = init; i <= end; i++) {
        if(currentValues[i] == "-"){
          let fault = {name: this.datas.monthData[j].Station, index: j};
          this._addFault(fault);
        }
        values[values.length] = currentValues[i];
      }
      res[j] = values;
    }
    return res;
  }

  getDuration(){
    return this.endYear-this.beginYear;
  }
  getStations(){
    let stations = [];
    for (let i = 0; i < this.datas.monthData.length; ++i) {
      stations[i] = this.datas.monthData[i].Station;
    }
    return stations;
  }
  getFaults(){
    return this.faults;
  }
  getMax(){
    return this.maxValue;
  }
  cleanFaults(){
    this.faults = [];
  }

  _addFault(fault){
    var exists = false;
    for (var i = 0; i < this.faults.length; i++) {
      if(this.faults[i].index == fault.index){ exists = true;break; }
    }
    if(!exists){this.faults.push(fault)}
  }
  _getDailyInitIndex(dates, year, month){
    let init = -1;
    for (let i = 0; i < dates.length; ++i) {
      let date = moment(dates[i], "DD/MM/YYYY");
      if(init == -1 && date.year() == year && date.month() == month) {
        init = i;
        break;
      }
    }
    return init;
  }
}

export default DataReader;

