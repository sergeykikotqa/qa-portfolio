---
title: AIC / Главная страница / Mobile hero UI checklist
slug: aic-mobile-hero-ui-checklist
project: aic
category: AIC / Homepage / Mobile hero
description: "Чек-лист для mobile hero: CTA, legal-блок, читаемость и интерактивность первого экрана."
items:
  - text: mobile hero отображается и остаётся доступным для проверки
    status: passed
    evidence:
      - AIC-TC-005
      - AIC-TC-006
    note: Первый экран доступен в мобильном сценарии и позволяет проверить CTA и legal-блок.
  - text: control «узнать больше» визуально заметен на первом экране
    status: passed
    evidence:
      - AIC-TC-005
    note: CTA заметен и воспринимается как интерактивный элемент.
  - text: текстовая часть control «узнать больше» вызывает ожидаемое действие
    status: passed
    evidence:
      - AIC-TC-005
    note: Проблема зафиксирована не в полном отсутствии интеракции, а в неполной кликабельной области.
  - text: точка и линия рядом с текстом кликабельны так же, как и текст
    status: failed
    evidence:
      - AIC-TC-005
      - "BUG: aic-mobile-hero-control-only-text-is-clickable"
    note: Декоративные части воспринимаются как часть одного control, но не участвуют в hit area.
  - text: весь visual control работает как единый tappable элемент
    status: failed
    evidence:
      - AIC-TC-005
      - "BUG: aic-mobile-hero-control-only-text-is-clickable"
    note: UX ожидание не совпадает с фактическим поведением.
  - text: hit area control комфортна для мобильного tap
    status: failed
    evidence:
      - AIC-TC-005
      - "BUG: aic-mobile-hero-control-only-text-is-clickable"
    note: Пользователь вынужден попадать только в текстовую часть, что уменьшает реальную tappable area.
  - text: legal-блок читается как цельный и аккуратный элемент
    status: failed
    evidence:
      - AIC-TC-006
    note: В project review зафиксировано, что блок выглядит визуально разорванным.
  - text: переносы строк в legal-блоке не выглядят рваными
    status: failed
    evidence:
      - AIC-TC-006
    note: Переносы в мобильной версии ухудшают визуальную целостность блока.
  - text: spacing в legal-блоке поддерживает аккуратную визуальную иерархию
    status: failed
    evidence:
      - AIC-TC-006
    note: Наблюдение относится к mobile adaptation и качеству первого экрана.
  - text: legal-ссылки выглядят профессионально и читаемо
    status: failed
    evidence:
      - AIC-TC-006
    note: Блок требует доработки по формулировкам, интервалам и переносам.
  - text: hero не даёт ощущения визуально сломанного первого экрана
    status: failed
    evidence:
      - AIC-TC-005
      - AIC-TC-006
    note: Комбинация неполной кликабельности CTA и неаккуратного legal-блока ухудшает первое впечатление.
  - text: на первом экране нет горизонтального overflow
    status: not_tested
    note: Отдельного артефакта по horizontal scroll пока нет.
  - text: остальные mobile-элементы hero не наезжают друг на друга
    status: not_tested
    note: Требуется отдельный smoke-проход по всему блоку, а не только по зафиксированным проблемам.
publishedAt: 2026-04-24
---
