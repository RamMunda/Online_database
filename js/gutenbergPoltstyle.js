console.log(ol);
var earthquakeData = [],foundSelectedData=[];
var vectorSource = new ol.source.Vector({
  url: 'data/geojson/countries.geojson',
  format: new ol.format.GeoJSON(),
});
var allContriesCoord = [];
$(document).ready(function(){
    $.get(' https://geodata-server.herokuapp.com/api/earthquakedata',function (data,stauts) {
      earthquakeData.push(JSON.parse(data));
    })

    $.get('data/geojson/countries.geojson',function (data,stauts) {
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

        gutenbergPlot();
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
    
    // Making data
    var allCountdata;
    var xAxisData;
    var RGlinePoints;
    var ScatterdataPoint;
    var lr = {} ;
    function MakeArraydata(data){
      allCountdata = [];
      xAxisData = [];
      RGlinePoints = [];
      ScatterdataPoint = [];
        var k,count1=0,count2=0,count3=0,count4=0,count5=0,count6=0,count7=0;
        for(k=0;k<data.length;k++){
          //  if(Number(data[k].Magn)>=1 && Number(data[k].Magn)<2){
          //     count1++;
          //  }
          //  else if(Number(data[k].Magn)>=2 && Number(data[k].Magn)<3){
          //     count2++;
          //  }
          //  else if(Number(data[k].Magn)>=3 && Number(data[k].Magn)<4){
          //     count3++;
          //  }
          //  else if(Number(data[k].Magn)>=4 && Number(data[k].Magn)<5){
          //     count4++;
          //  }
          //  else if(Number(data[k].Magn)>=5 && Number(data[k].Magn)<6){
          //     count5++;
          //  }
          //  else if(Number(data[k].Magn)>=6 && Number(data[k].Magn)<7){
          //     count6++;
          //  }
          //  else if(Number(data[k].Magn)>=7 && Number(data[k].Magn)<8){
          //   count7++;
          //  }
           if(Number(data[k].Magn)>=1){
            count1++;
            }
            if(Number(data[k].Magn)>=2){
                count2++;
            }
            if(Number(data[k].Magn)>=3){
                count3++;
            }
            if(Number(data[k].Magn)>=4){
                count4++;
            }
            if(Number(data[k].Magn)>=5){
                count5++;
            }
            if(Number(data[k].Magn)>=6){
                count6++;
            }
            if(Number(data[k].Magn)>=7){
              count7++;
            }

        }
        console.log(count1,count2,count3,count4,count5,count6,count7);
        if(count1!=0){
          allCountdata.push(Math.log(count1));
          xAxisData.push(1);
        }
        if(count2!=0){
          allCountdata.push(Math.log(count2));
          xAxisData.push(2);
        }
        if(count3!=0){
          allCountdata.push(Math.log(count3));
          xAxisData.push(3);
        }
        if(count4!=0){
          allCountdata.push(Math.log(count4));
          xAxisData.push(4);
        }
        if(count5!=0){
          allCountdata.push(Math.log(count5));
          xAxisData.push(5);
        }
        if(count6!=0){
          allCountdata.push(Math.log(count6));
          xAxisData.push(6);
        }
        if(count7!=0){
          allCountdata.push(Math.log(count7));
          xAxisData.push(7);
        }
        console.log(allCountdata);
        console.log(xAxisData);
        var known_y = allCountdata;
        var known_x = xAxisData;
        lr = [];
        var lr = linearRegression(known_y, known_x);
        for(con=0;con<xAxisData.length;con++){
          RGlinePoints.push([xAxisData[con],(((lr.slope)*xAxisData[con])+lr.intercept)]);
        }
        for(Rgp=0;Rgp<xAxisData.length;Rgp++){
          ScatterdataPoint.push([xAxisData[Rgp],allCountdata[Rgp]]);
        }
        console.log(RGlinePoints);
        console.log(ScatterdataPoint);
        console.log(lr);

    }
      function gutenbergPlot(){
        console.log(lr);
        console.log(lr);
       
        Highcharts.chart('container', {
          title: {
            text: 'Scatter plot with regression line'
          },
          xAxis: {
            min: 0,
            max: 7
          },
          yAxis: {
            min: 0
          },
          series: [{
            type: 'line',
            name: 'Magnitude',
            data: RGlinePoints,
            marker: {
              enabled: false
            },
            states: {
              hover: {
                lineWidth: 0
              }
            },
            enableMouseTracking: false
          }, {
            type: 'scatter',
            name: 'Observations',
            data: ScatterdataPoint,
            marker: {
              radius: 4
            }
          }]
        });
      }
      console.log(earthquakeData);
      function linearRegression(y,x){
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;
    
        for (var i = 0; i < y.length; i++) {
    
            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        } 
    
        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
        lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

        document.querySelector('.avalue').textContent = lr['intercept'];
        document.querySelector('.bvalue').textContent = -(lr['slope']);

    
        return lr;
    }
      
});





 