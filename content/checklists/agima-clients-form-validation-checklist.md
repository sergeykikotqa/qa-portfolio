---
title: AGIMA / Форма «Стать клиентом» / Validation checklist
slug: agima-clients-form-validation-checklist
project: qamanual
category: AGIMA / Clients form
description: Чек-лист для валидации формы «Стать клиентом» и базового UX поведения полей и ошибок.
items:
  - text: страница открывается без явных визуальных поломок
    status: passed
    evidence:
      - AGIMA-TC-001
      - AGIMA-TC-003
    note: Страница и форма были доступны во время выполнения позитивных сценариев.
  - text: блок Контактные данные отображается корректно
    status: passed
    evidence:
      - AGIMA-TC-001
      - AGIMA-TC-004
    note: Блок использовался во всех проверках формы без отдельного визуального дефекта.
  - text: все поля и кнопка отправки видимы
    status: passed
    evidence:
      - AGIMA-TC-001
      - AGIMA-TC-003
    note: Поля Email, Телефон и submit были доступны для позитивных сценариев.
  - text: обязательные поля визуально понятны
    status: not_tested
    note: Для этого пункта пока нет отдельного test case или bug report с фокусом на визуальные маркеры обязательности.
  - text: поле Email принимает корректный email
    status: passed
    evidence:
      - AGIMA-TC-001
    note: Позитивный сценарий для корректного email оформлен отдельным test case.
  - text: поле Email отклоняет значение без домена
    status: failed
    evidence:
      - AGIMA-TC-002
      - "BUG: email-weak-validation-accepts-invalid-values"
    note: Найден дефект слабой валидации Email.
  - text: поле Email отклоняет значение с пробелом
    status: failed
    evidence:
      - AGIMA-TC-002
      - "BUG: email-weak-validation-accepts-invalid-values"
    note: Поле принимает часть значений с пробелом как валидные.
  - text: поле Email отклоняет кириллицу в email, если формат этого не допускает
    status: failed
    evidence:
      - AGIMA-TC-002
      - "BUG: email-weak-validation-accepts-invalid-values"
    note: Зафиксирован кейс `test@и`, который проходит как валидный.
  - text: поле Email отклоняет некорректную структуру после @
    status: failed
    evidence:
      - AGIMA-TC-002
      - "BUG: email-weak-validation-accepts-invalid-values"
    note: Валидация после символа `@` работает слишком слабо.
  - text: поле Email показывает понятную ошибку при невалидном значении
    status: failed
    evidence:
      - AGIMA-TC-002
      - "BUG: email-weak-validation-accepts-invalid-values"
    note: Для части невалидных значений ошибка не появляется, потому что поле считает их валидными.
  - text: поле Телефон принимает корректный номер
    status: passed
    evidence:
      - AGIMA-TC-003
    note: Позитивный сценарий на корректный номер оформлен отдельным test case.
  - text: поле Телефон не принимает слишком короткое значение
    status: failed
    evidence:
      - AGIMA-TC-004
      - "BUG: phone-field-does-not-restrict-format-length-or-character-type"
    note: "Найден дефект: слишком короткие значения проходят валидацию."
  - text: поле Телефон не принимает буквы
    status: failed
    evidence:
      - AGIMA-TC-004
      - "BUG: phone-field-does-not-restrict-format-length-or-character-type"
    note: Поле считает буквенные значения валидными.
  - text: поле Телефон не принимает смешанные значения 123abc
    status: failed
    evidence:
      - AGIMA-TC-004
      - "BUG: phone-field-does-not-restrict-format-length-or-character-type"
    note: Смешанные буквенно-цифровые строки принимаются как валидные.
  - text: поле Телефон не принимает чрезмерно длинную строку
    status: failed
    evidence:
      - AGIMA-TC-004
      - "BUG: phone-field-does-not-restrict-format-length-or-character-type"
    note: Зафиксирован приём длинного произвольного текста.
  - text: поле Телефон корректно обрабатывает copy-paste
    status: failed
    evidence:
      - "BUG: phone-field-does-not-restrict-format-length-or-character-type"
    note: Через copy-paste принимается большой фрагмент текста.
  - text: поле Телефон ограничивает ввод по формату или валидирует при отправке
    status: failed
    evidence:
      - AGIMA-TC-004
      - "BUG: phone-field-does-not-restrict-format-length-or-character-type"
    note: Поле не ограничивает формат и не отбрасывает очевидно невалидные значения.
  - text: кнопка submit не отправляет форму с невалидными данными
    status: failed
    evidence:
      - AGIMA-TC-002
      - AGIMA-TC-004
      - "BUG: submit-button-active-with-empty-required-field"
    note: В форме уже зафиксированы проблемы валидации и отдельный дефект по поведению submit.
  - text: после исправления ошибок форма может быть отправлена
    status: not_tested
    note: Отдельного подтверждённого сценария на успешное исправление ошибок пока нет.
  - text: ошибки сбрасываются после ввода валидных значений
    status: not_tested
    note: Для этого поведения пока не оформлен отдельный test case.
  - text: текст ошибок читаемый
    status: not_tested
    note: Нет отдельного кейса или бага, который подтверждает качество текста ошибок.
  - text: ошибки показываются рядом с нужным полем
    status: failed
    evidence:
      - "BUG: email-weak-validation-accepts-invalid-values"
      - "BUG: phone-field-does-not-restrict-format-length-or-character-type"
    note: Для части невалидных значений ошибка не показывается вообще, поэтому обратная связь по полю неполная.
  - text: пользователь понимает, что именно нужно исправить
    status: failed
    evidence:
      - "BUG: email-weak-validation-accepts-invalid-values"
      - "BUG: phone-field-does-not-restrict-format-length-or-character-type"
    note: При слабой валидации форма не всегда даёт пользователю понятный сигнал о некорректном значении.
publishedAt: 2026-04-14
---
