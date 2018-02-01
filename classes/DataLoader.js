class DataLoader {
  constructor(){
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
  _loadFiles(){
    this.monthData = this_loadJSON("datas/monthlyDatas2007.json");
    this.dayData = this_loadJSON("datas/dailyDatas2007.json");
    this.hourData = this_loadJSON("datas/hourlyDatas2013.json");
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
  _loadJSONFile(path){
    return loadJSON(path, function(err, json){
      if (err) {
        console.log("Failed to load: " + path);
        return;
      }
      return json;
    }
  };
}

export default DataLoader;

