---
title: AGIMA / Главная страница / Мобильная версия корректно отображает контент без предварительного scroll
slug: agima-mobile-homepage-renders-without-initial-scroll
caseId: AGIMA-TC-005
project: qamanual
category: AGIMA / Homepage / Mobile UI
summary: >-
  Негативный сценарий. Priority: High. Проверка initial render мобильной
  главной без предварительного scroll.
steps:
  - Открыть главную страницу в мобильной версии
  - Дождаться полной загрузки
  - Не выполнять scroll
  - Проверить отображение первого и следующих контентных блоков
expectedResult: >-
  Страница должна корректно инициализировать контент сразу после загрузки,
  блоки не должны доотрисовываться только после первого scroll, а пользователь
  должен видеть корректную мобильную верстку без дополнительного действия.
publishedAt: 2026-04-14
---
## Type

Negative

## Priority

High

## Preconditions

- Открыта главная страница `https://www.agima.ru/`
- Используется mobile viewport или реальное мобильное устройство
