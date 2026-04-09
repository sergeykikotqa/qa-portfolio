---
title: Поле "Телефон" принимает неограниченно длинное значение
slug: qamanual-issue-1
project: qamanual
severity: medium
priority: medium
status: open
summary: >-
  Поле "Телефон" принимает неограниченно длинное числовое значение и помечает
  его как валидное


  ---
environment: |-
  - Browser: Firefox
  - OS: Windows

  ---
steps:
  - 'Открыть https://www.agima.ru/clients/'
  - Перейти к форме контактов
  - 'Ввести длинный номер телефона, например: 99852155484846'
  - Обратить внимание на валидацию
  - '---'
expected: >-
  Поле должно ограничивать длину номера или показывать ошибку при вводе слишком
  длинного значения


  ---
actual: |-
  Поле принимает длинный номер и показывает успешную валидацию (зелёная галочка)

  ---
screenshots: []
publishedAt: '2026-04-09'
updatedAt: '2026-04-09T07:31:22.000Z'
importedAt: '2026-04-09T07:33:40.162Z'
source: github
generated: true
sourceRepo: sergeykikotqa/qa-practice
sourceIssueNumber: 1
sourceIssueUrl: 'https://github.com/sergeykikotqa/qa-practice/issues/1'
labelsRaw:
  - bug
  - portfolio
  - 'project:qamanual'
  - 'severity:medium'
labelsNormalized: []
---
Форма не проверяет корректность длины номера телефона
