import { Triennial } from './triennial';

for (let i = 5758; i < 5822; i += 3) {
    const tri = new Triennial(i);
    const readings = tri.getReadings();
    const nv3 = readings["Nitzavim-Vayeilech"][3];
    if (typeof nv3 !== 'undefined') {
        console.log("Nitzavim-Vayeilech", nv3);
    } else {
        console.log("Nitzavim", readings["Nitzavim"][3]);
        console.log("Vayeilech", readings["Vayeilech"][3]);
    }
    const cb2 = readings["Chukat-Balak"][2];
    if (typeof cb2 !== 'undefined') {
        console.log("Chukat-Balak", cb2);
    } else {
        console.log("Chukat", readings["Chukat"][2]);
        console.log("Balak", readings["Balak"][2]);
    }
}

const tri0 = new Triennial();
const readings = tri0.getReadings();
console.log(readings["Bereshit"][1]);

