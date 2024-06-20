import * as api from "./api.js"
import * as objectsCommon from "./objectsCommon.js"

//var myMap;
// Дождёмся загрузки API и готовности DOM.

async function initMap() {
  await ymaps3.ready;
  const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-markers@0.0.1');

  const {YMap, YMapDefaultSchemeLayer, YMapMarker, YMapFeatureDataSource, YMapDefaultFeaturesLayer} = ymaps3;

  const map = new YMap(
      document.getElementById('map'),
      {
          location: {
              center: [61.379045, 55.158188],
              zoom: 10
          }
      },
      [
        // Add a map scheme layer
        new YMapDefaultSchemeLayer({}),
        // Add a layer of geo objects to display the markers
        new YMapDefaultFeaturesLayer({})
      ]
  );

  const colors = {
    1: '#00254A',
    2: '#0BC976',
    3: '#EB8006'
  }

  const objects = (await api.getObjectsList()).objects;
  console.log(objects);

  const objectSource = objects.map((object) => {
    return {coordinates: [object.y, object.x], 
      title: object.name,
      color: colors[object.category],
      popup: {content: `<a href = "object.html?id=${object.id}">${object.name}</a>`, position: 'left'}
    }
  })
  console.log(objectSource);

  const markersGeoJsonSource = [
    {
      coordinates: [61.402554, 55.159897],
      title: 'Челябинск',
      subtitle: 'Челябинск is the Largest Island <br> in North America and the World',
      color: '#00CC00',
      popup: {content: '<a href="google.com">Ccskrf</a>', position: 'left'}
    },
  ];
/*
  const markerElement = document.createElement('div');
  markerElement.className = 'marker-class';
  markerElement.innerText = "I'm marker!";

  const marker = new YMapMarker(
    {
      coordinates: [61.402554, 55.159897],
      draggable: true,
      mapFollowsOnDrag: true
    },
    markerElement
  );

  map.addChild(marker);
  */
  objectSource.forEach((markerSource) => {
    const marker = new YMapDefaultMarker(markerSource);
    map.addChild(marker);
  });

}


initMap();