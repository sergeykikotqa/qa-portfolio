---
title: Поле "Телефон" принимает слишком короткие значения и помечает их как валидные
slug: qamanual-issue-2
project: qamanual
severity: medium
priority: medium
status: open
summary: >-
  Поле "Телефон" принимает слишком короткие числовые значения и помечает их как
  валидные


  ---
environment: |-
  - Browser: Firefox
  - OS: Windows

  ---
steps:
  - 'Открыть https://www.agima.ru/clients/'
  - Перейти к форме контактов
  - 'Ввести короткий номер телефона, например: 3459'
  - Обратить внимание на валидацию поля
  - '---'
expected: |-
  Поле должно проверять минимальную длину номера телефона  
  При вводе слишком короткого значения должна отображаться ошибка

  ---
actual: >-
  Поле принимает короткое значение и отображает успешную валидацию (зелёная
  галочка)


  ---
screenshots: []
publishedAt: '2026-04-09'
updatedAt: '2026-04-09T07:31:24.000Z'
importedAt: '2026-04-09T07:33:40.162Z'
source: github
generated: true
sourceRepo: sergeykikotqa/qa-practice
sourceIssueNumber: 2
sourceIssueUrl: 'https://github.com/sergeykikotqa/qa-practice/issues/2'
labelsRaw:
  - bug
  - portfolio
  - 'project:qamanual'
  - 'severity:medium'
labelsNormalized: []
---
Минимальная длина номера телефона не проверяется
