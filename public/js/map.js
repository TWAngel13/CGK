//import * as database from './database.js'

var myMap;
// Дождёмся загрузки API и готовности DOM.

async function init () {
    var routeSelect = document.getElementById('route-select');

    

    const map = new ymaps3.YMap(document.getElementById('map'), {
        location: {
          center: [37.64, 55.76],
          zoom: 10
        }
      });

}