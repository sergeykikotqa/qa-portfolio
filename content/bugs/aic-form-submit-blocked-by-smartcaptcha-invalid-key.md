---
title: "Отправка формы «Начать проект» блокируется: SmartCaptcha возвращает Invalid key, captcha-check завершается 403 Forbidden"
slug: aic-form-submit-blocked-by-smartcaptcha-invalid-key
project: aic
severity: high
priority: high
status: open
summary: "Отправка формы «Начать проект» блокируется на этапе captcha-проверки: SmartCaptcha возвращает Invalid key, а captcha-check завершается 403 Forbidden."
environment: Chrome / Windows / Incognito / no VPN
steps:
  - Открыть страницу формы «Начать проект»
  - Заполнить поля формы данными, проходящими клиентскую валидацию
  - Нажать кнопку «Отправить»
  - Открыть DevTools -> Console / Network
  - Проверить результат captcha-проверки
expected: Форма должна корректно проходить captcha-проверку и завершать отправку заявки без ошибок Invalid key и 403 Forbidden.
actual: Во время submit SmartCaptcha возвращает Invalid key, captcha-check завершается 403 Forbidden, и отправка заявки не завершается.
screenshots: []
publishedAt: 2026-04-24
---
## Раздел

Форма «Начать проект»

## Reproducibility

Always

## Source

Manual testing

## Actual Result

Во время submit в Console и Network фиксируются ошибки captcha:

- `[SmartCaptcha] Invalid key. Check that key is correct`
- `captcha-check` returns `403 Forbidden`

После этого заявка не отправляется.

## Expected Result

Форма должна корректно проходить captcha-проверку и завершать отправку без
ошибок `Invalid key` и `403 Forbidden`.

## Business Impact

- Пользователь не может завершить обращение через форму.
- Бизнес рискует терять входящие лиды и заявки.

## Note

Проблема воспроизводилась без VPN, поэтому сбой не сводится только к
географическим ограничениям или локальной сетевой среде.
