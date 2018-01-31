function showErrors(graph){
  faults = graph.getFaults();
  if(faults.length > 0){
    $("#notifications").show();
    stringFaults = "Les données suivantes sont incomplètes : <span class='missingData'>";
    for(let i=0; i<faults.length; i++){
        i>0 ? stringFaults += `, ${faults[i].name}` : stringFaults += `${faults[i].name}`;
    }
    stringFaults += "</span>.";
    $('#notifications').html(stringFaults);
  }else{
    $("#notifications").hide();
  }
}

function getStations(graph){
  let stations = graph.dataReader.getStations();
  let select = $("#stations");
  for(let i = 0; i < stations.length; ++i) {
    let opt = '<option value="' + i + '">' + stations[i] + '</option>';
    select.append(opt);
  }
}
