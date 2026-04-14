---
title: AGIMA / Форма «Стать клиентом» / Поле Email принимает корректный email
slug: agima-email-accepts-valid-email
caseId: AGIMA-TC-001
project: qamanual
category: AGIMA / Clients form / Validation
summary: >-
  Позитивный сценарий. Priority: High. Проверка корректного email при валидном
  заполнении формы.
steps:
  - Ввести в поле Email корректное значение, например test@example.com
  - Заполнить остальные обязательные поля валидными данными
  - Проверить состояние поля Email
  - Нажать кнопку отправки формы
expectedResult: >-
  Поле Email не подсвечивается ошибкой, значение считается валидным, а форма
  может быть отправлена при корректном заполнении остальных обязательных полей.
publishedAt: 2026-04-14
---
## Type

Positive

## Priority

High

## Preconditions

- Открыта страница `https://www.agima.ru/clients/`
- Пользователь находится в блоке `Контактные данные`
