---
title: AIC / Форма «Начать проект» / Submit не получает Invalid key и 403 на captcha-check
slug: aic-form-submit-does-not-hit-invalid-key-or-403-on-captcha-check
caseId: AIC-TC-003
project: aic
category: AIC / Start project form / Captcha integration
summary: >-
  Негативный сценарий. Priority: High. Проверка технической стабильности
  captcha integration во время submit.
steps:
  - Открыть страницу с формой «Начать проект»
  - Заполнить форму валидными данными
  - Открыть DevTools и перейти в Console и Network
  - Нажать кнопку отправки формы
  - Проверить логи Console и сетевые запросы, связанные с captcha
  - Сравнить фактический результат с ожидаемым
expectedResult: >-
  Во время submit captcha-проверка проходит без ошибок `Invalid key`, запрос
  `captcha-check` не возвращает `403 Forbidden`, а форма не блокируется на
  техническом уровне.
publishedAt: 2026-04-24
---
## Type

Negative

## Priority

High

## Preconditions

- Открыта страница с формой `Начать проект`
- Доступны DevTools для проверки Console и Network
- Введены данные, достаточные для normal submit

## Monitoring

- Console
- Network
- Поведение кнопки отправки и формы после submit
