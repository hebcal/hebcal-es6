import geo from './geo.js';

const cities = {
    cities: {},

//    geo: {},

	getCity(str) {
        return this.cities[str.toLowerCase()];
    },

    init() {
//        console.log("Loading geo.json...");
//        geo = import './geo.json';
        console.debug(`Parsing ${geo.cities.length} cities`);
        this.cities = this.loadCities(geo.cities);
        //this.initCityAliases();    
    },

    loadCities(allCities) {
        let cities = {};
		const cityObjs = allCities.map(this.parseCityString);
		for (const city of cityObjs) {
            const cityLc = city.name.toLowerCase();
            let aliasLc;
            if (city.cc == 'US') {
                const stateLc = geo.stateNames[city.state].toLowerCase();
                aliasLc = `${cityLc} ${stateLc}`;
            } else {
                const countryLc = city.country.toLowerCase();
                aliasLc = `${cityLc} ${countryLc}`;
            }
            if (!cities[cityLc]) {
                cities[cityLc] = city;
            }
            cities[aliasLc] = city;
        }
        // this is silly, but alias the first occurrence of each country and US state
		for (const city of cityObjs) {
            if (city.cc == 'US') {
                const stateLc = geo.stateNames[city.state].toLowerCase();
                if (!cities[stateLc]) {
                    cities[stateLc] = city;
                }
            } else {
                const countryLc = city.country.toLowerCase();
                if (!cities[countryLc]) {
                    cities[countryLc] = city;
                }
            }
        }
        return cities;
    },

    parseCityString(f) {
        const cityName = f[0];
        const country = f[1];
        const admin1 = f[2];
        const latitude = +f[3];
        const longitude = +f[4];
        const tzid = f[5];
        const geoid = f[6];

        const city = {
            name: cityName,
            cc: country,
            latitude,
            longitude,
            tzid
        };

        if (geoid) {
            city.geoid = +geoid;
        }
        if (country == 'US') {
            city.state = admin1;
            city.cityName = `${cityName}, ${admin1}`;
        } else {
            const countryName = geo.countryNames[country];
            city.country = countryName;
            city.cityName = `${cityName}, ${countryName}`;
        }
        return city;
    },

    initCityAliases() {
        const aliasMap = {
            'new york': ['nyc', 'n y c', 'new york city', 'new york new york'],
            'beer sheva': ['beersheba'],
            'the bronx': ['bronx', 'bronx new york'],
            'los angeles': ['la', 'l a'],
            'washington': ['dc', 'd c', 'washington dc', 'washington d c'],
            'london': ['england', 'great britain', 'britain'],
            'glasgow': ['scotland'],
            'belfast': ['northern ireland'],
            'cardiff': ['wales'],
            'south lake tahoe': ['lake tahoe', 'tahoe'],
            'las vegas': ['vegas']
        };
        for (const city in aliasMap) {
            const c = this.cities[city];
            const aliases = aliasMap[city];
            for (let i = 0; i < aliases.length; i++) {
                this.cities[aliases[i]] = c;
            }
        }
    }
}

export default cities;
