class Color {
  constructor(){
    this.isColorInverse = false;
  }
  inverseColor(){
    this.isColorInverse = !this.isColorInverse;
  }
  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  echelleTeintes(nbElem, hex) {
    if(hex === undefined)
      hex = true;
    var avancement = 255/nbElem;
    var colorTab = [];
    var myColor = 0;

    for (var i = 0; i < nbElem; i++) {
      if (this.isColorInverse) {
        myColor = (i+1)*avancement;
      }else{
        myColor = 255-(i+1)*avancement;
      }

      if (myColor<0) {
        myColor = 0;
      }
      var r, g, b;

      var colorPicked = parseInt(document.getElementById("colorChoice").value);

      switch(colorPicked){
        case 0:
          // Nuances de rose claire
          r = 255; g = Math.floor(myColor); b = 255;
          break;
        case 1:
          // Jaune au rouge
          r = 255; g = Math.floor(myColor); b = 0;
          break;
        case 2:
          // Vert claire à vert foncé
          r = 0; g = Math.floor(myColor); b = 0;
          break;
        case 3:
          // Bleu claire à bleu foncé
          r = 0; g = Math.floor(myColor); b = 255;
          break;
        case 4:
          // Nuances de jaune claire
          r = 255; b = Math.floor(myColor); g = 255;
          break;
        case 5:
          // rose à rouge
          r = 255; b = Math.floor(myColor); g = 0;
          break;
        case 6:
          // Bleu à noir
          r = 0; b = Math.floor(myColor); g = 0;
          break;
        case 7:
          // Bleu claire à Vert claire
          r = 0; b = Math.floor(myColor); g = 255;
          break;
        case 9:
          // Jaune à vert claire
          b = 0; r = Math.floor(myColor); g = 255;
          break;
        case 10:
          // Rouge à noir
          b = 0; r = Math.floor(myColor); g = 0;
          break;
        case 11:
          // Rose à bleu claire
          b = 255; r = Math.floor(myColor); g = 0;
          break;
        case 8:
        default:
          // Nuances de bleu claire
          b = 255; r = Math.floor(myColor); g = 255;
      }
      if (hex) {
        colorTab[i] = "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
      } else {
        colorTab[i] = {r:r, g:g, b:b};
      }
    }
    return colorTab;
  }
}

