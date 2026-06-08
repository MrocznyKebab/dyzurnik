/*
  Dyżurnik — logika aplikacji

  TODO:
  1. Dane miejsc pracy.
  2. Dane dyżurów.
  3. Dodawanie dyżuru.
  4. Edycja dyżuru.
  5. Usuwanie dyżuru.
  6. Podsumowanie miesiąca.
  7. Obliczanie kwoty.
  8. localStorage.
*/

const workplaces = [
  {
    id: 1,
    name: "Szpital Wyszyńskiego",
    stationaryRate: 80,
    onCallRate: 30
  },
  {
    id: 2,
    name: "Przychodnia Waligóry",
    stationaryRate: 70,
    onCallRate: 25
  }
];

const duties = [
  {
    id: 1,
    date: "2026-09-12",
    startTime: "07:00",
    endTime: "19:00",
    workplaceId: 1,
    stationaryHours: 8,
    onCallHours: 4
  }
];

function calculateDutyPay(duty) {
  const workplace = workplaces.find(place => place.id === duty.workplaceId);

  if (!workplace) {
    return null;
  }

  const stationaryPay = duty.stationaryHours * workplace.stationaryRate;
  const onCallPay = duty.onCallHours * workplace.onCallRate;

  return {
    stationaryPay,
    onCallPay,
    totalPay: stationaryPay + onCallPay,
    totalHours: duty.stationaryHours + duty.onCallHours
  };
}

// TODO: render listy dyżurów
// TODO: dodawanie dyżuru
// TODO: edycja dyżuru
// TODO: usuwanie dyżuru
// TODO: podsumowanie miesiąca
// TODO: zapis do localStorage
