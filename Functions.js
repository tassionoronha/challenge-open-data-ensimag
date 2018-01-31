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
  let select = $("#stations");
  for(let i = 0; i < graph.monthData.length; ++i) {
    let opt = '<option value="' + i + '">' + graph.monthData[i].Station + '</option>';
    select.append(opt);
  }
}
