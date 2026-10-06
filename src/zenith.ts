/**
 * Solar zeniths and depression angles shared by the zmanim calculations.
 *
 * A _zenith_ is measured from directly overhead, so the horizon is 90°.
 * A _depression angle_ is measured below the horizon, which is what
 * {@link Zmanim.timeAtAngle}, {@link Zmanim.tzeit} and the `*Deg` fields
 * of {@link CalOptions} take; `Zmanim` adds {@link GEOMETRIC_ZENITH} back.
 * Names and values follow KosherJava's `ZENITH_*` constants in
 * [ComprehensiveZmanimCalendar](https://github.com/KosherJava/zmanim/blob/master/src/main/java/com/kosherjava/zmanim/ComprehensiveZmanimCalendar.java).
 */

/**
 * The zenith of astronomical sunrise and sunset. The sun is 90° from the vertical 0°
 */
export const GEOMETRIC_ZENITH = 90;

/**
 * The zenith of civil twilight; the sun is 6° below the horizon.
 * Matches `NOAACalculator.CIVIL_ZENITH`.
 */
export const CIVIL_ZENITH = GEOMETRIC_ZENITH + 6;

/**
 * The zenith of 1.583° below geometric zenith (90°). This calculation is used for
 * calculating _netz amiti_ (sunrise) and _shkiah amiti_ (sunset) based on the opinion of the
 * [Baal Hatanya](https://en.wikipedia.org/wiki/Shneur_Zalman_of_Liadi).
 */
export const ZENITH_1_POINT_583 = GEOMETRIC_ZENITH + 1.583;

/**
 * Tzeit HaKochavim as calculated by Rabbi Yechiel Michel Tucazinsky,
 * 6.45° below the horizon. Default end time for Tish'a B'Av.
 * KosherJava's `ZENITH_6_POINT_45`.
 */
export const DEG_6_POINT_45 = 6.45;

/**
 * Observation of 3 medium-sized stars, 7°5′ (7.083°) below the horizon.
 * Default end time for minor fasts in the Diaspora, and the basis of
 * _bein hashmashos_. KosherJava's `ZENITH_7_POINT_083` is
 * `GEOMETRIC_ZENITH + 7 + (5.0 / 60)`; adding {@link GEOMETRIC_ZENITH} to
 * this value gives exactly the same `97.08333333333333`.
 */
export const DEG_7_POINT_083 = 7 + 5 / 60;

/**
 * Tzeit HaKochavim, 8.5° below the horizon: the position of the sun 36
 * minutes after sunset in Jerusalem around the equinox / equilux, when the
 * Ohr Meir considers 3 small stars to be visible. Default for Havdalah.
 * KosherJava's `ZENITH_8_POINT_5`.
 */
export const DEG_8_POINT_5 = 8.5;

/**
 * Alot HaShachar, 16.1° below the horizon. Default start time for minor
 * fasts. KosherJava's `ZENITH_16_POINT_1`.
 */
export const DEG_16_POINT_1 = 16.1;
