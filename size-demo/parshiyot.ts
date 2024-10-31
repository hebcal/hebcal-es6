import {HebrewCalendar} from '../dist/index';

const events = HebrewCalendar.calendar({
  year: new Date().getFullYear() - 1,
  numYears: 2,
  sedrot: true,
  noHolidays: true,
});

console.log(
  events.map(event => ({
    datetime: event.date.greg(),
    label: event.render('he-x-NoNikud'),
  }))
);
