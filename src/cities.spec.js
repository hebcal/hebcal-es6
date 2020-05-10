import test from 'ava';
import cities from './cities';

test('getCity', t => {
    cities.init();

    let city = cities.getCity("Tel Aviv");
    t.is(city.latitude, 32.08088);
    t.is(city.longitude, 34.78057);
    t.is(city.tzid, "Asia/Jerusalem");
    t.is(city.cc, "IL");

    city = cities.getCity("Sao Paulo");
    t.is(city.latitude, -23.5475);
    t.is(city.longitude, -46.63611);
    t.is(city.tzid, "America/Sao_Paulo");
    t.is(city.cc, "BR");

    city = cities.getCity("London");
    t.is(city.latitude, 51.50853);
    t.is(city.longitude, -0.12574);
    t.is(city.tzid, "Europe/London");
    t.is(city.cc, "GB");

    city = cities.getCity("Providence");
    t.is(city.latitude, 41.82399);
    t.is(city.longitude, -71.41283);
    t.is(city.tzid, "America/New_York");
    t.is(city.cc, "US");

    city = cities.getCity("Melbourne");
    t.is(city.latitude, -37.814);
    t.is(city.longitude, 144.96332);
    t.is(city.tzid, "Australia/Melbourne");
    t.is(city.cc, "AU");
});
