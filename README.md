# Dyżurnik

## Link do aplikacji

https://mrocznykebab.github.io/dyzurnik/


Aplikacja do zapisywania i rozliczania dyżurów.

## Link do Figmy

https://www.figma.com/design/g0vv7CNG2hDxb2RJotLwpT/Dy%C5%BCurnik?node-id=0-1&t=5YidxCY9tcGXvaZf-1

## Cel aplikacji

Dyżurnik pomaga zapisywać dyżury oraz rozliczać godziny pracy w różnych miejscach. Użytkownik może ustawić miejsca pracy wraz ze stawkami, a następnie dodawać dyżury z podziałem na godziny stacjonarne i godziny pod telefonem.

Aplikacja automatycznie podsumowuje godziny i kwotę do wypłaty za wybrany miesiąc.

## Ekrany aplikacji

### 1. Rejestr dyżurów

- wybór miesiąca,
- kafelki z podsumowaniem:
  - godziny stacjonarne,
  - godziny pod telefonem,
  - łączna liczba godzin,
  - kwota do wypłaty,
- lista dyżurów,
- przyciski: dodaj, edytuj, usuń.

### 2. Dodaj / edytuj dyżur

Formularz zawiera:

- datę,
- godzinę rozpoczęcia,
- godzinę zakończenia,
- miejsce pracy,
- godziny stacjonarne,
- godziny pod telefonem.

Stawki są pobierane z ustawień miejsca pracy.

### 3. Ustawienia

Użytkownik może ustawić miejsca pracy, np.:

- Szpital Wyszyńskiego,
- Przychodnia Waligóry.

Każde miejsce pracy ma:

- nazwę,
- stawkę stacjonarną,
- stawkę pod telefonem.

Dodatkowo ustawienia mogą zawierać:

- motyw aplikacji,
- rozmiar czcionki.

## MVP do zakodowania

- lista dyżurów,
- dodawanie dyżuru,
- edycja dyżuru,
- usuwanie dyżuru,
- wybór miesiąca,
- miesięczne podsumowanie godzin,
- miesięczne podsumowanie kwoty,
- ustawienia miejsc pracy ze stawkami,
- zapis danych w localStorage.\
- oznaczenie dyżuru jako "rozliczony"

## Nie robimy w MVP

- logowania,
- backendu,
- pełnego kalendarza,
- generowania faktur PDF,
- integracji z kalendarzem.

## Model danych

### Miejsce pracy

```js
{
  id: 1,
  name: "Szpital Wyszyńskiego",
  stationaryRate: 80,
  onCallRate: 30
}
