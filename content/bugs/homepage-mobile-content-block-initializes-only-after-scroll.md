---
title: Главная страница в mobile view корректно инициализирует контентный блок только после scroll
slug: homepage-mobile-content-block-initializes-only-after-scroll
project: qamanual
severity: high
priority: high
status: open
summary: В mobile view после полной загрузки главной страницы часть контента отображается некорректно до первого scroll, а после прокрутки происходит визуальная доинициализация блока.
environment: Chrome / Windows / DevTools Mobile Viewport 400x858
steps:
  - Открыть https://www.agima.ru/
  - Включить mobile viewport, например 400x858
  - Дождаться полной загрузки страницы
  - Не выполнять scroll
  - Проверить отображение главной страницы
  - Выполнить scroll вниз
  - Сравнить состояние страницы до и после scroll
expected: Контент главной страницы должен корректно отображаться сразу после полной загрузки, без необходимости дополнительной прокрутки страницы.
actual: После полной загрузки страницы в mobile view часть контента отображается некорректно до первого scroll. После scroll происходит визуальная доинициализация / перерисовка блока, и страница начинает отображаться корректнее.
screenshots: []
relatedLinks:
  - label: Открыть страницу AGIMA
    url: https://www.agima.ru/
publishedAt: 2026-04-14
---
## URL

https://www.agima.ru/

## Раздел

Главная страница

## Reproducibility

Sometimes

## Additional Notes

По DevTools у основного контейнера наблюдается изменение состояния после scroll.

До scroll:

```html
<div class="index-wrapper js-lazy-page lazy-page">
```

После scroll:

```html
<div class="index-wrapper js-lazy-page lazy-page lazy-page--loaded">
```

Это совпадает с визуальным изменением отображения страницы в mobile view.

## Business Impact

- Пользователь видит некорректный initial render на главной странице.
- Ухудшается первое впечатление и доверие к сайту.
- Проблема может негативно влиять на конверсию.

## Attachments

- Скриншот до scroll
- Скриншот после scroll
