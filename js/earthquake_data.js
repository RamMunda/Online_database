var earthquake_data = []
var GenralFeature = [];
var customGenralFeature = [];
var Lat, Lon;
var point;
var PopupElement;
var minMagnitude,maxMagnitude,minDepth,maxDepth;
$(document).ready(function(){
  if(earthquake_data.length==0){
    $.get(' https://geodata-server.herokuapp.com/api/isc-data',function (data,stauts) {
      if(earthquake_data.length==0){
        earthquake_data.push(JSON.parse(data));
        Reploting(1000);
      }
    })    
  }
  var preloaderElement = document.getElementById('preloader');
  $('#map').bind('DOMSubtreeModified', function(){
    if(document.querySelector('.ol-viewport')){
      console.log('changed');
      preloaderElement.style.display = "none";
    }
    else{
      preloaderElement.style.display = "block";     
    }
  });
  var optionForquery = document.querySelector('.select_option');
  optionForquery.addEventListener('change',function(){
    console.log("it's change");
    console.log(optionForquery.value);
    var RemovableElement = document.querySelector('.ol-viewport');
    RemovableElement.remove();
    PopupElement = document.createElement('div');
    PopupElement.setAttribute('id','popup');
    document.querySelector('.map_data_container').append(PopupElement);
    setTimeout(()=>{
      Reploting(optionForquery.value);
    },2000);
  })

  var ApplySearch = document.getElementById('apply_search');
  ApplySearch.addEventListener('click',function(){

    minMagnitude = document.querySelector('.min_magnitude').value;
    maxMagnitude = document.querySelector('.max_magnitude').value;
    
    minDepth = document.querySelector('.min_depth').value;
    maxDepth = document.querySelector('.max_mdepth').value;
    var RemovableElement = document.querySelector('.ol-viewport');
    RemovableElement.remove();
    PopupElement = document.createElement('div');
    PopupElement.setAttribute('id','popup');
    document.querySelector('.map_data_container').append(PopupElement);
    setTimeout(()=>{
      DepthAndMagnitudeRangeReploiting(minDepth,maxDepth,minMagnitude,maxMagnitude);

    },2000);
  })

  function Reploting(maxNumdata){
   GenralFeature = [];
   console.log(maxNumdata)
    var j,l=maxNumdata;
    for(j=0;j<l-1;j++){
        
         point = new ol.geom.Point([earthquake_data[0].data[j].Lon,earthquake_data[0].data[j].Lat]);
        //  if(j>2000-1){
        //    customGenralFeature.push(new ol.Feature(point));
        //  }
         GenralFeature.push(new ol.Feature(point))
    }
    ol.proj.useGeographic();
    var place = [78, 27];      
    var point = new ol.geom.Point(place);
    var map = new ol.Map({
      target: 'map',
      view: new ol.View({
        center: place,
        zoom: 5,
      }),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        new ol.layer.Vector({
          source: new ol.source.Vector({
            features: GenralFeature,
          }),
          style: new ol.style.Style({
            image: new ol.style.Circle({
              radius: 5,
              fill: new ol.style.Fill({color: 'rgba(154, 18, 179, 1)'}),
              stroke: new ol.style.Stroke({color: 'rgba(0,0,0,1)'})
            }),
          }),
        }) ],
    });

    var element = document.getElementById('popup');

    var popup = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10],
    });
    map.addOverlay(popup);

    function formatCoordinate(coordinate) {
      console.log(coordinate);
      var k;
      for(k=0;k<l-1;k++){
        if(Number(earthquake_data[0].data[j].Depth)>=Number(minDepth) && Number(earthquake_data[0].data[j].Depth)<=Number(maxDepth) && Number(earthquake_data[0].data[j].Magn)>=Number(minMagnitude) && Number(earthquake_data[0].data[j].Magn)<=Number(maxMagnitude)){
          console.log(earthquake_data[0].data[k]);
          return ("\n  <table>\n   <tr><th>ISC event</th> <th>Agency</th> <th>Original Time</th> <th>Depth</th> <th>Lat</th> <th>Long</th> <th>Magn</th> <th>N</th></tr> <tr> <td>"+ earthquake_data[0].data[k].ISC_event+"</td> <td>"+ earthquake_data[0].data[k].Agency +"</td>  <td>"+ earthquake_data[0].data[k].Origin_Time +"</td>  <td>"+ earthquake_data[0].data[k].Depth +"</td>   <td>"+ earthquake_data[0].data[k].Lat +"</td>  <td>"+ earthquake_data[0].data[k].Lon +"</td>   <td>"+ earthquake_data[0].data[k].Magn +"</td>  <td>"+ Number(earthquake_data[0].data[k].N)  +"</td> </tr>   </table>");

        }
      }
    }
    map.on('click', function (event) {
      var feature = map.getFeaturesAtPixel(event.pixel)[0];
      console.log(map.getFeaturesAtPixel(event.pixel));
      if (feature) {
        var coordinate = feature.getGeometry().getCoordinates();
        console.log("popup",popup);
        popup.setPosition(coordinate);
        $(element).popover({
          container: element.parentElement,
          html: true,
          sanitize: false,
          content: formatCoordinate(coordinate),
          placement: 'top',
        });
        $(element).popover('show');
      } else {
        $(element).popover('dispose');
      }
    });

    map.on('pointermove', function (event) {
      if (map.hasFeatureAtPixel(event.pixel)) {
        map.getViewport().style.cursor = 'pointer';
      } else {
        map.getViewport().style.cursor = 'inherit';
      }
    });
  }


  function DepthAndMagnitudeRangeReploiting(minDepth, maxDepth, minMagnitude, maxMagnitude){
     GenralFeature = [];
     var j,l=19000;
     console.log(typeof(minDepth));
     console.log(typeof(earthquake_data[0].data[200].Depth));

     for(j=0;j<l-1;j++){
         if(Number(earthquake_data[0].data[j].Depth)>=Number(minDepth) && Number(earthquake_data[0].data[j].Depth)<=Number(maxDepth)){
           console.log("matched");
            point = new ol.geom.Point([earthquake_data[0].data[j].Lon,earthquake_data[0].data[j].Lat]);
          //  if(j>2000-1){
          //    customGenralFeature.push(new ol.Feature(point));
          //  }
            GenralFeature.push(new ol.Feature(point));
         }

     }
     console.log("GenralFeature",GenralFeature);
     ol.proj.useGeographic();
     var place = [78, 27];      
     var point = new ol.geom.Point(place);
     var map = new ol.Map({
       target: 'map',
       view: new ol.View({
         center: place,
         zoom: 5,
       }),
       layers: [
         new ol.layer.Tile({
           source: new ol.source.OSM(),
         }),
         new ol.layer.Vector({
           source: new ol.source.Vector({
             features: GenralFeature,
           }),
           style: new ol.style.Style({
             image: new ol.style.Circle({
               radius: 5,
               fill: new ol.style.Fill({color: 'rgba(154, 18, 179, 1)'}),
               stroke: new ol.style.Stroke({color: 'rgba(0,0,0,1)'})
             }),
           }),
         }) ],
     });
 
     var element = document.getElementById('popup');
 
     var popup = new ol.Overlay({
       element: element,
       positioning: 'bottom-center',
       stopEvent: false,
       offset: [0, -10],
     });
     map.addOverlay(popup);
 
     function formatCoordinate(coordinate) {
       console.log(coordinate);
       var k;
       for(k=0;k<l-1;k++){
         if(earthquake_data[0].data[k].Lon==coordinate[0] && earthquake_data[0].data[k].Lat==coordinate[1]){
           console.log(earthquake_data[0].data[k]);
           return ("\n  <table>\n   <tr><th>ISC event</th> <th>Agency</th> <th>Original Time</th> <th>Depth</th> <th>Lat</th> <th>Long</th> <th>Magn</th> <th>N</th></tr> <tr> <td>"+ earthquake_data[0].data[k].ISC_event+"</td> <td>"+ earthquake_data[0].data[k].Agency +"</td>  <td>"+ earthquake_data[0].data[k].Origin_Time +"</td>  <td>"+ earthquake_data[0].data[k].Depth +"</td>   <td>"+ earthquake_data[0].data[k].Lat +"</td>  <td>"+ earthquake_data[0].data[k].Lon +"</td>   <td>"+ earthquake_data[0].data[k].Magn +"</td>  <td>"+ Number(earthquake_data[0].data[k].N)  +"</td> </tr>   </table>");
 
         }
       }
     }
     map.on('click', function (event) {
       var feature = map.getFeaturesAtPixel(event.pixel)[0];
       console.log(map.getFeaturesAtPixel(event.pixel));
       if (feature) {
         var coordinate = feature.getGeometry().getCoordinates();
         console.log("popup",popup);
         popup.setPosition(coordinate);
         $(element).popover({
           container: element.parentElement,
           html: true,
           sanitize: false,
           content: formatCoordinate(coordinate),
           placement: 'top',
         });
         $(element).popover('show');
       } else {
         $(element).popover('dispose');
       }
     });
 
     map.on('pointermove', function (event) {
       if (map.hasFeatureAtPixel(event.pixel)) {
         map.getViewport().style.cursor = 'pointer';
       } else {
         map.getViewport().style.cursor = 'inherit';
       }
     });
   }
});
