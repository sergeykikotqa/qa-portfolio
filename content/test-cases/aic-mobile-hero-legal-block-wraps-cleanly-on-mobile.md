---
title: AIC / Mobile hero / Legal-блок на мобильной версии переносится аккуратно и остаётся читаемым
slug: aic-mobile-hero-legal-block-wraps-cleanly-on-mobile
caseId: AIC-TC-006
project: aic
category: AIC / Homepage / Mobile hero legal block
summary: >-
  Негативный сценарий. Priority: Medium. Проверка адаптации legal-блока в
  mobile hero без визуально рваных переносов и потери иерархии.
steps:
  - Открыть главную страницу AIC в мобильной версии
  - Найти legal-блок в hero-секции
  - Проверить переносы строк и расстояния между legal-ссылками
  - Сравнить визуальное восприятие блока с соседними элементами первого экрана
  - Убедиться, что legal-блок читается как цельный и аккуратно оформленный элемент
expectedResult: >-
  Legal-блок в mobile hero остаётся читаемым, ссылки не выглядят визуально
  разорванными, а переносы строк и интервалы не ломают общий вид первого
  экрана.
publishedAt: 2026-04-24
---
## Type

Negative

## Priority

Medium

## Preconditions

- Открыта главная страница AIC
- Используется mobile viewport или реальное мобильное устройство

## Notes

- Этот кейс основан на UI review observation и помогает показать внимание не
  только к bug-level дефектам, но и к качеству мобильной адаптации.
