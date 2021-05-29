console.log(ol);
var earthquakeData = [],foundSelectedData=[];
var vectorSource = new ol.source.Vector({
  url: 'data/geojson/countries.geo.json',
  format: new ol.format.GeoJSON(),
});
var allContriesCoord = [];

$(document).ready(function(){
    $.get(' https://geodata-server.herokuapp.com/api/earthquakedata',function (data,stauts) {
      earthquakeData.push(JSON.parse(data));
    })

    $.get('../data/geojson/countries.geojson',function (data,stauts) {
      console.log(data.features);
        allContriesCoord.push(data.features);
    });

    var map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        new ol.layer.Vector({
          source: vectorSource,
        }) ],
      target: 'map',
      view: new ol.View({
        center: [79, 25],
        zoom: 2,
        constrainRotation: 16,
      }),
    });
    
    // a normal select interaction to handle click
    var select = new ol.interaction.Select();
    map.addInteraction(select);
    
    var selectedFeatures = select.getFeatures();
    
    // a DragBox interaction used to select features by drawing boxes
    var dragBox = new ol.interaction.DragBox({
      condition: ol.events.condition.platformModifierKeyOnly,
    });
    
    map.addInteraction(dragBox);
    
    dragBox.on('boxend', function () {
      // features that intersect the box geometry are added to the
      // collection of selected features
    
      // if the view is not obliquely rotated the box geometry and
      // its extent are equalivalent so intersecting features can
      // be added directly to the collection
      var rotation = map.getView().getRotation();
      var oblique = rotation % (Math.PI / 2) !== 0;
      var candidateFeatures = oblique ? [] : selectedFeatures;
      var extent = dragBox.getGeometry().getExtent();
      vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
        candidateFeatures.push(feature);
      });
    
      // when the view is obliquely rotated the box extent will
      // exceed its geometry so both the box and the candidate
      // feature geometries are rotated around a common anchor
      // to confirm that, with the box geometry aligned with its
      // extent, the geometries intersect
      if (oblique) {
        var anchor = [0, 0];
        var geometry = dragBox.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        var extent$1 = geometry.getExtent();
        candidateFeatures.forEach(function (feature) {
          var geometry = feature.getGeometry().clone();
          geometry.rotate(-rotation, anchor);
          if (geometry.intersectsExtent(extent$1)) {
            selectedFeatures.push(feature);
          }
        });
      }
    });
    
    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function () {
      selectedFeatures.clear();
    });
    var infoBox = document.getElementById('info');
    var selectedCountryCoordinate,mypolygon,c,d,selectedCountry,result,names="";
    selectedFeatures.on(['add', 'remove'], function () {
      selectedCountryCoordinate = [],mypolygon = [];
        names = selectedFeatures.getArray().map(function (feature) {
        selectedCountry = feature.get('name');
        console.log("selectedCountry",selectedCountry);
        // Number of total countries are 179
        for(c=0;c<179;c++){
          if(allContriesCoord[0][c].properties.name == selectedCountry){
            selectedCountryCoordinate.push(allContriesCoord[0][c].geometry.coordinates);
            console.log('found country');
          }
        }
        console.log("earthquakeData",earthquakeData);
        console.log(typeof(selectedCountry));
        // console.log("earthquakeData.selectedCountry",earthquakeData[0][Afganistan]);
        MakeArraydata(earthquakeData[0][selectedCountry]);

        //
        var d = document.getElementsByTagNameNS('iframe','iframe');
        console.log(d.length);

        makechart();
        return feature.get('name');
        // return feature.get('NAME_1');
      });
      if (names.length > 0) {
        infoBox.innerHTML = names.join(', ');
      } else {
        infoBox.innerHTML = 'No countries selected';
      }
    });
      map.on("pointermove", function(event) {
        var lonlat = ol.proj.transform(event.coordinate, 'EPSG:3857','EPSG:4326');
        document.getElementById('lat').textContent = lonlat[0];
        document.getElementById('long').textContent = lonlat[1];
     });
    
    // Create Polygon
      var allCountdata;

      console.log(result)
      function MakeArraydata(data){
        allCountdata = [];
          console.log("data",data);
          var k,count0=0,count1=0,count2=0,count3=0,count4=0,count5=0,count6=0,count7=0,count8=0;
          for(k=0;k<data.length;k++){
             if(Number(data[k].Magn)>=0 && Number(data[k].Magn)<1){
              count0++;
             }
             else if(Number(data[k].Magn)>=1 && Number(data[k].Magn)<2){
                count1++;
             }
             else if(Number(data[k].Magn)>=2 && Number(data[k].Magn)<3){
                count2++;
             }
             else if(Number(data[k].Magn)>=3 && Number(data[k].Magn)<4){
                count3++;
             }
             else if(Number(data[k].Magn)>=4 && Number(data[k].Magn)<5){
                count4++;
             }
             else if(Number(data[k].Magn)>=5 && Number(data[k].Magn)<6){
                count5++;
             }
             else if(Number(data[k].Magn)>=6 && Number(data[k].Magn)<7){
                count6++;
             }
             else if(Number(data[k].Magn)>=7 && Number(data[k].Magn)<8){
              count7++;
             }
             else if(Number(data[k].Magn)>=8 && Number(data[k].Magn)<9){
              count8++;
             }

          }
          allCountdata.push(count1);
          allCountdata.push(count2);
          allCountdata.push(count3);
          allCountdata.push(count4);
          allCountdata.push(count5);
          allCountdata.push(count6);
          allCountdata.push(count7);
          allCountdata.push(count8);

      }
      function makechart(){
        var xValues = [0,1,2,3,4,5,6,7,8];
        var yValues = allCountdata;

        console.log(allCountdata);
        // generateData("Math.log(number[x]) / Math.log(10)", 0, 8, 0.5);
        // generateData("Math.log(x)", 0, 8, 0.5);

        
        new Chart("myChart", {
          type: "line",
          yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'LABEL',
            },
            type: 'logarithmic',
            position: 'left',
            ticks: {
                 min: 0.1, //minimum tick
                 max: 1000, //maximum tick
            },
        }],
          data: {
            labels: xValues,
            datasets: [{
              fill: false,
              pointRadius: 1,
              borderColor: "rgba(0,0,255,0.5)",
              data: yValues
            }]
          },    
          options: {
            legend: {display: false},
            title: {
              display: true,
              text: "Log N(m) = a - bm",
              fontSize: 14
            }
          }
        });

        // function generateData(value, i1, i2, step = 1) {
        //   for (let x = i1; x <= i2; x += step) {
        //     yValues.push(eval(value));
        //     xValues.push(x);
        //   }
        // }
      }
      
});





 