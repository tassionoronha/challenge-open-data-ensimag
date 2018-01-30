class Graphique {
  constructor() {
    this.colors = [
      {r:38,g:142,b:22},
      {r:77,g:24,b:115},
      {r:172,g:168,b:26},
      {r:251,g:29,b:45},
      {r:27,g:59,b:114},
      {r:172,g:89,b:26},
      {r:221,g:27,b:122},
      {r:255,g:139,b:31},
      {r:57,g:174,b:190},
      {r:176,g:242,b:70},
      {r:255,g:244,b:0},
      {r:29,g:230,b:110},
    ];
    this.beginYear = 2007;
    this.endYear = 2018;
  }

  getColor(i){
    return this.colors[i%this.colors.length];
  }

  getRGBColor(color) {
    return color.r + "," + color.g + "," + color.b;
  }

  getColorScale(nbColors, RGB){
    let colors = [];
    let step = Math.floor(255/nbColors);
    for (let i = 0; i < nbColors; ++i) {
      let value = step + i * step;
      switch (RGB) {
      case 0:
        colors[i] = {r:value, g:0 , b:127};
        break;
      case 1:
        colors[i] = {g:value, r:127 , b:0};
        break;
      default:
        colors[i] = {b:value, g:127 , r:0};
        break;
      }
    }
    return colors;
  }
}

export default Graphique;
