function showErrorsRadar(radar){
  var faults = radar.getFaults();
  var faultsValues = Object.values(faults);
  var faults = Object.keys(faults);
  if(faults){
    $("#notifications").show();

    stringFaults = "Les stations à suivre manquent quellques donnés: ";
    initialLenght = stringFaults.length;
    console.log(faultsValues);
    console.log(radar.state);
    for(let i=0; i<faults.length; i++){
      //validar se existe nos filtros
      if(!radar.state[faultsValues[i]]){
        if(stringFaults.length > initialLenght){
          stringFaults += `, ${faults[i]}`;
        }else{
          stringFaults += `${faults[i]}`;
        }
      }
    }

    if(stringFaults.length == initialLenght){
      $("#notifications").hide();
    }
  }

    stringFaults += ".";
    $('#notifications').html(stringFaults);
}
