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

function getStations(radar){
  let select = $("#stations");
  for(let i = 0; i < radar.data.length; ++i) {
    let opt = '<option value="' + i + '">' + radar.data[i].Station + '</option>';
    select.append(opt);
  }
}
