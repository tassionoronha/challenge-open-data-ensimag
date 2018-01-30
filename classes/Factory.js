import MultiGraph from './MultiGraph.js';
import MultiLignes from './MultiLignes.js';

class Factory{
  constructor(type, args){
    if(this.validateArgs(type, args)){
      this.chart = new MultiGraph(type, args);
    }

    return this;
  }

  getChart(){
    return this.chart;
  }

  validateArgs(type, args){
    if (type != 'radar' && type != 'line'){
      throw "Bad type";
      return false;
    }
    if (args.type == 0 || args.type == 2) {
      if(args.year < 2007 || args.year > 2017){
        throw "Bad year!";
        return false;
      }
    } else if (args.type == 1) {
      if (args.station < 0 || args.station >= Object.values(monthlyDatas).length){
        throw "Bad station!";
        return false;
      }
    }

    if(typeof(args.canvas) != "object"){
      throw "Bad canvas!";
      return false;
    }

    return true;
  }
}

export default Factory;
