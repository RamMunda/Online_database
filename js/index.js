var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([79, 25]),
      zoom: 4
    })
  });

  var utarray = [235,904,743,748,232,233,235,236,246,249,250,252,747,748,894,893,892,891,890,928,927,926,925,924,923,922,921,920,919,918,917,916,915,914,913,912,911,910,909,908,907,906,905,904,903,902,901,900,899,898,897,896,895,894];
var Hp = [225,228,229,230,231,232,234,237,238,239,240,241,242,243,244,245,247,248,251,253,254,255,256,257,258]
var jkarray = [225,226,228,229,237,271,280,289,290,291,292,293,294,295,296,298,299,300,304,305,306,307,308,310,312,313,314,864,886,888];
var himProv = [5,52,53,220,226,244,934,185,201,202,215,225,228,231,232,246,313,697,859,901,928,934,935,936,214,289,689,889,890,891,892,938,939,940,941,162,165,166,167,174,178,188,189,289];
var no_ofFaults = 0;
var allData = [];
document.addEventListener('click',function(){
  $.get('xfaults.json',function (data,stauts) {
      if(allData.length==0){
        allData.push(data);
        console.log(allData);
      }

  })
});

window.addEventListener('click',function(){
    setTimeout(()=>{
      var featureLength = allData[0].features.length-1;
      var k,i;
      for(k=0;k<featureLength;k++){
      var innerCoordinateLength = allData[0].features[k].geometry.coordinates.length-1;
      for(i=0;i<innerCoordinateLength;i++){
      var lonlat = ol.proj.fromLonLat([allData[0].features[k].geometry.coordinates[i][0], allData[0].features[k].geometry.coordinates[i][1]]);
              var location2 = ol.proj.fromLonLat([allData[0].features[k].geometry.coordinates[i+1][0], allData[0].features[k].geometry.coordinates[i+1][1]]);

              //create the line's style
              var linieStyle = [
                          // linestring
                          new ol.style.Style({
                            stroke: new ol.style.Stroke({
                              color: 'rgba(255,0,0,0.5)',
                              width: 2
                            })
                          })
                        ];

              //create the line       
              var linie = new ol.layer.Vector({
                      source: new ol.source.Vector({
                      features: [new ol.Feature({
                          geometry: new ol.geom.LineString([lonlat, location2]),
                          name: 'Line',
                          prop :allData[0].features[k].properties
                      })]
                  })
              });

              //set the style and add to layer
              linie.setStyle(linieStyle);
              map.addLayer(linie);
      }         
      }
        
    },1000);
});

var popup = new ol.Overlay({
    element: document.getElementById('popup'),
  });
  map.addOverlay(popup); 
  map.on('click', function(evt){
      var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });
      console.log(feature);
      if(feature.values_.prop.Id.length>0){
          feature.values_.prop.Id = feature.values_.prop.Id;      
      }
      else{
          feature.values_.prop.Id = "";
      }
        if(feature.values_.prop.Name.length>0){
          feature.values_.prop.Name = feature.values_.prop.Name;      
      }
      else{
          feature.values_.prop.Name = "";
      }
        if(feature.values_.prop.Type.length>0){
          feature.values_.prop.Type = feature.values_.prop.Type;      
      }
      else{
          feature.values_.prop.Type = "";
      }
      var element = popup.getElement();
      var coordinate = evt.coordinate;
    var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));  
    $(element).popover('dispose');
    popup.setPosition(coordinate);
    $(element).popover({
    container: element,
    placement: 'top',
    animation: false,
    html: true,
    content:'<p id="fault_id">'+'ID : '+feature.values_.prop.Id +'</p>'+'<p id="fault_name">'+'Name : '+feature.values_.prop.Name+'</p>'+'<p id="falut_type">'+'Type : '+feature.values_.prop.Type + '</p>'
        
    });
    $(element).popover('show');
  });
  
  
   map.on("pointermove", function(event) {
    var lonlat = ol.proj.transform(event.coordinate, 'EPSG:3857',
    'EPSG:4326');
    document.getElementById('lat').textContent = lonlat[0];
    document.getElementById('long').textContent = lonlat[1];
   });
  