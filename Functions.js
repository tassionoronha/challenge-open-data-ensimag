function showErrorsRadar(radar){
  faults = radar.getFaults();
  if(faults.length > 0){
    $("#notifications").show();
    stringFaults = "Les stations à suivre manquent quellques donnés: ";
    for(let i=0; i<faults.length; i++){
        i>0 ? stringFaults += `, ${faults[i].station}` : stringFaults += `${faults[i].station}`;
    }
    stringFaults += ".";
    $('#notifications').html(stringFaults);
  }else{
    $("#notifications").hide();
  }
}
