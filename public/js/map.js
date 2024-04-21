//import * as database from './database.js'

//var myMap;
// Дождёмся загрузки API и готовности DOM.

async function initMap() {
  await ymaps3.ready;

  const {YMap, YMapDefaultSchemeLayer} = ymaps3;

  const map = new YMap(
      document.getElementById('map'),
      {
          location: {
              center: [61.379045, 55.158188],
              zoom: 10
          }
      }
  );

  map.addChild(new YMapDefaultSchemeLayer());
}

initMap();