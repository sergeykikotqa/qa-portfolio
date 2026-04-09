---
title: >-
  Некорректная валидация полей формы (телефон и email принимают невалидные
  значения)
slug: qamanual-issue-3
project: qamanual
severity: medium
priority: medium
status: open
summary: >-
  Некорректная валидация полей формы (телефон и email принимают невалидные
  значения)


  ---
environment: |-
  - Browser: Firefox
  - OS: Windows

  ---
steps:
  - '#### Телефон'
  - 'Открыть https://www.agima.ru/clients/'
  - 'Ввести в поле "Телефон":'
  - 'короткое значение: 3459'
  - 'длинное значение: 99852155484846'
  - 'текст: ыва2265 или +7(999)abc'
  - Обратить внимание на валидацию
  - '#### Email'
  - 'Ввести в поле "Электронная почта":'
  - test@pos
  - +7(999)abc@pos
  - Обратить внимание на валидацию
  - '---'
expected: |-
  - Поле "Телефон" должно:
    - проверять формат номера
    - ограничивать длину
    - запрещать ввод букв

  - Поле "Email" должно:
    - проверять корректный формат email (user@domain.tld)
    - отклонять неполные значения

  ---
actual: >-
  - Поле "Телефон" принимает:
    - слишком короткие значения
    - слишком длинные значения
    - буквенные символы  
    и помечает их как валидные

  - Поле "Email" принимает некорректные значения без доменной части (например:
  test@pos) и помечает их как валидные


  ---
screenshots: []
publishedAt: '2026-04-09'
updatedAt: '2026-04-09T07:31:27.000Z'
importedAt: '2026-04-09T07:33:40.162Z'
source: github
generated: true
sourceRepo: sergeykikotqa/qa-practice
sourceIssueNumber: 3
sourceIssueUrl: 'https://github.com/sergeykikotqa/qa-practice/issues/3'
labelsRaw:
  - bug
  - portfolio
  - 'project:qamanual'
  - 'severity:medium'
labelsNormalized: []
---
Валидация формы отсутствует или реализована некорректно
