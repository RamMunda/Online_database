var earthquake_data = []

$(document).ready(function(){
  if(earthquake_data.length==0){
    $.get(' https://geodata-server.herokuapp.com/api/isc-data',function (data,stauts) {
      if(earthquake_data.length==0){
        earthquake_data.push(JSON.parse(data));
        console.log(earthquake_data);
      }
  })    
  }

});


var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([20.096, -5.36]),
      zoom: 3
    })
  });