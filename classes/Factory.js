import MultiRadar from './MultiRadar.js';
import MultiLignes from './MultiLignes.js';

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

export default Factory;
