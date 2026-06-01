import {
  CalculationMethod,
  Coordinates,
  Madhab,
  PrayerTimes,
} from "adhan";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export function calculatePrayerTimes(input: {
  lat: number;
  lng: number;
  date: string;
}) {
  const [year, month, day] = input.date.split("-").map(Number);
  const coordinates = new Coordinates(input.lat, input.lng);
  const params = CalculationMethod.Karachi();
  params.madhab = Madhab.Hanafi;
  const prayerTimes = new PrayerTimes(
    coordinates,
    new Date(Date.UTC(year, month - 1, day)),
    params,
  );

  return {
    fajr: formatTime(prayerTimes.fajr),
    sunrise: formatTime(prayerTimes.sunrise),
    dhuhr: formatTime(prayerTimes.dhuhr),
    asr: formatTime(prayerTimes.asr),
    maghrib: formatTime(prayerTimes.maghrib),
    isha: formatTime(prayerTimes.isha),
  };
}
