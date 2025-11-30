import {getSedra} from '../dist/esm/sedra';
const sedra = getSedra(5757, false);
console.log(sedra.lookup(729122).parsha);
