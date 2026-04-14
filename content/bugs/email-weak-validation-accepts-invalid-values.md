---
title: Поле Email проходит слабую валидацию и принимает некорректные значения
slug: email-weak-validation-accepts-invalid-values
project: qamanual
severity: high
priority: high
status: open
summary: Поле Email считает валидными часть значений с некорректной структурой после символа "@", включая варианты без корректного домена и с пробелом.
environment: Chrome / Windows
steps:
  - Открыть https://www.agima.ru/clients/
  - Прокрутить до формы «Стать клиентом» и блока «Контактные данные»
  - Ввести в поле «Электронная почта» разные тестовые значения
  - Проверить состояние поля после ввода
expected: Поле должно принимать только корректный email-формат и отклонять значения без корректного домена, с пробелами и с некорректной структурой после символа "@"
actual: Поле принимает часть некорректных email-значений как валидные.
screenshots: []
relatedLinks:
  - label: Открыть форму AGIMA
    url: https://www.agima.ru/clients/
publishedAt: 2026-04-14
---
## URL

https://www.agima.ru/clients/

## Раздел

Форма «Стать клиентом» -> блок «Контактные данные» -> поле «Электронная почта»

## Reproducibility

Always

## Source

Manual testing

## Test Data

- `test@` -> invalid
- `test@t` -> valid
- `test@и` -> valid
- `test @2` -> valid
- `test@@2` -> invalid

## Actual Result

Поле принимает часть некорректных email-значений как валидные.

## Expected Result

Поле должно принимать только корректный email-формат и отклонять значения:

- без корректного домена
- с пробелами
- с некорректной структурой после `@`

## Business Impact

- В систему могут попадать невалидные email-адреса.
- Снижается качество лидов.
- Усложняется дальнейшая коммуникация с клиентом.
