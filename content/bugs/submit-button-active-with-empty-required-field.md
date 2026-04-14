---
title: Кнопка отправки формы активна при пустом обязательном поле
slug: submit-button-active-with-empty-required-field
project: qamanual
severity: medium
priority: medium
status: open
summary: Кнопка submit остаётся активной, хотя обязательное поле не заполнено.
environment: Windows 11, Chrome 135, локальная сборка
steps:
  - Открыть форму и оставить обязательное поле пустым.
expected: Кнопка должна быть неактивна или форма должна блокировать отправку.
actual: Кнопка активна и позволяет отправить форму.
screenshots: []
publishedAt: 2026-03-27
hidden: true
---
