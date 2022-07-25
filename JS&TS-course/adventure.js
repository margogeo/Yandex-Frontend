'use strict';

const fetch = require('node-fetch');

const API_KEY = require('./key.json');

function getWeather(geoId) {

  function check(weather) {
    if (weather == 'clear' || weather == 'partly-cloudy') return 's'; 
    if (weather == 'cloudy' || weather == 'overcast') return 'c';
    return 'b';
  }
   return fetch('https://api.weather.yandex.ru/v2/forecast?geoid='+geoId+'&hours=false&limit=7',
    {
      method: 'GET',
      headers: {
        'X-Yandex-API-Key': API_KEY.key  
      }
    }).then(response => response.json())
    .catch(error => {throw new Error('Failed to get ' + error);}).then(j => ({id: geoId, weather: j['forecasts'].map(d => check(d['parts']['day_short']['condition']))}))
    .catch(error => {throw new Error('Unknown error ' + error);});
}

class TripBuilder {
  constructor(geoIds) {
    this.geoIds = geoIds;
    this.maxim = 100000;
    this.conds = [];
  }

  sunny(days) {
    let i = 0;
    while (i < days) {
      i++;
      this.conds.push('s');
    }

    return this;
  }

  cloudy(days) {
    let i = 0;
    while (i < days) {
      i++;
      this.conds.push('c');
    }
    return this;
  }

  max(daysCount) {
    this.maxim = daysCount;
    return this;
  }

  build() {
    return Promise.all(this.geoIds.map(getWeather)).then(cities => {
      let cityDay = new Map();

      let path = (vis, prev) => {

        if (vis.length === this.conds.length) return vis;

        for (let i = 0; i < cities.length; i++) {
          let cur;
          if (cityDay.has(cities[i].id))
            cur = cityDay.get(cities[i].id);
          else 
            cur = 0;

          if (cities[i].weather[vis.length] === this.conds[vis.length] &&(cur === 0 ||(cities[i].id === prev && cur < this.maxim))) {
            cityDay.set(cities[i].id, cur + 1);

            let end = path(vis.concat({ geoid: cities[i].id, day: vis.length + 1 }), cities[i].id);

            if (end) return end;

            cityDay.set(cities[i].id, cur);
          }
        }

        return null;
      };

      let result = path([], -1);

      if (result) return result;

      throw new Error('Не могу построить маршрут!');
    });
  }
}

function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};
