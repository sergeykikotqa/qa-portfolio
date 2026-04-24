---
title: AIC / Mobile hero / Весь control «узнать больше» кликабелен по полной визуальной области
slug: aic-mobile-hero-learn-more-control-clickable-across-full-area
caseId: AIC-TC-005
project: aic
category: AIC / Homepage / Mobile hero CTA
summary: >-
  Негативный сценарий. Priority: Medium. Проверка, что mobile hero control
  работает как единый интерактивный элемент по всей своей визуальной области.
steps:
  - Открыть главную страницу AIC в mobile viewport или на мобильном устройстве
  - Найти control «узнать больше» в hero-блоке
  - Нажать по текстовой части элемента
  - Повторить действие, нажимая по точке и линии рядом с текстом
  - Сравнить результат всех вариантов взаимодействия
expectedResult: >-
  Если текст, точка и линия визуально образуют один control, нажатие по любой
  части элемента должно вызывать один и тот же переход или интеракцию.
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

- Сценарий нужен для проверки consistency между визуальным видом control и его hit area.
