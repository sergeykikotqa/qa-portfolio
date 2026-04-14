---
title: AGIMA / Форма «Стать клиентом» / Поле Email отклоняет невалидные значения
slug: agima-email-rejects-invalid-values
caseId: AGIMA-TC-002
project: qamanual
category: AGIMA / Clients form / Validation
summary: >-
  Негативный сценарий. Priority: High. Проверка, что форма не принимает
  некорректные email-значения.
steps:
  - "Ввести в поле Email одно из невалидных значений: test@, test @2, test@и"
  - Проверить состояние поля
  - Попробовать отправить форму
expectedResult: >-
  Поле должно показывать ошибку валидации, невалидное значение не должно
  считаться корректным email, а форма не должна отправляться, пока email не
  исправлен.
publishedAt: 2026-04-14
---
## Type

Negative

## Priority

High

## Preconditions

- Открыта страница `https://www.agima.ru/clients/`
- Пользователь находится в блоке `Контактные данные`

## Test Data

- `test@`
- `test @2`
- `test@и`
