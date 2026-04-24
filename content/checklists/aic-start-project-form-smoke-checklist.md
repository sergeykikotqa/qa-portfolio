---
title: AIC / Форма «Начать проект» / Smoke & error-handling checklist
slug: aic-start-project-form-smoke-checklist
project: aic
category: AIC / Start project form
description: Чек-лист для smoke-проверки формы «Начать проект», captcha integration и поведения интерфейса при submit error.
items:
  - text: страница с формой открывается без явной визуальной поломки
    status: passed
    evidence:
      - AIC-TC-001
      - AIC-TC-003
    note: Базовый доступ к форме подтверждён во время проверок submit и captcha integration.
  - text: обязательные поля формы доступны для ввода
    status: passed
    evidence:
      - AIC-TC-001
      - AIC-TC-002
    note: Поля удаётся заполнить данными, проходящими клиентскую валидацию.
  - text: кнопка отправки отображается и реагирует на взаимодействие
    status: passed
    evidence:
      - AIC-TC-001
      - AIC-TC-003
    note: Кнопка submit доступна и запускает сценарий отправки.
  - text: captcha загружается как часть пользовательского flow
    status: passed
    evidence:
      - AIC-TC-001
      - AIC-TC-003
    note: Проблема зафиксирована не на уровне видимости формы, а на уровне прохождения проверки и submit.
  - text: валидно заполненная форма может быть успешно отправлена
    status: failed
    evidence:
      - AIC-TC-001
      - "BUG: aic-form-submit-blocked-by-smartcaptcha-invalid-key"
    note: Happy path ломается из-за проблемной captcha integration.
  - text: captcha integration не возвращает Invalid key при normal submit
    status: failed
    evidence:
      - AIC-TC-003
      - "BUG: aic-form-submit-blocked-by-smartcaptcha-invalid-key"
    note: В Console зафиксировано сообщение `Invalid key`.
  - text: запрос captcha-check не завершается 403 Forbidden
    status: failed
    evidence:
      - AIC-TC-003
      - "BUG: aic-form-submit-blocked-by-smartcaptcha-invalid-key"
    note: Проверка captcha падает на сетевом уровне с 403.
  - text: submit не блокируется технической ошибкой captcha
    status: failed
    evidence:
      - AIC-TC-003
      - "BUG: aic-form-submit-blocked-by-smartcaptcha-invalid-key"
    note: Отправка не доходит до ожидаемого успешного завершения.
  - text: при ошибке security check пользователь получает понятное сообщение
    status: failed
    evidence:
      - AIC-TC-002
      - "BUG: aic-form-captcha-failure-has-no-user-error-message"
    note: Интерфейс не сообщает человеку, что именно пошло не так.
  - text: текст ошибки подсказывает следующий шаг пользователю
    status: failed
    evidence:
      - AIC-TC-002
      - "BUG: aic-form-captcha-failure-has-no-user-error-message"
    note: Пользователь не получает рекомендации повторить попытку позже или проверить статус отправки.
  - text: пользователь понимает, отправилась заявка или нет
    status: failed
    evidence:
      - AIC-TC-002
      - "BUG: aic-form-captcha-failure-has-no-user-error-message"
    note: При ошибке captcha форма не даёт однозначной обратной связи по результату submit.
  - text: после технической ошибки введённые данные сохраняются
    status: not_tested
    note: Для этого recovery-flow уже оформлен отдельный test case AIC-TC-004, но подтверждённого результата пока нет.
  - text: после технической ошибки доступна повторная попытка отправки
    status: not_tested
    note: Требует отдельного подтверждения во время повторного прогона recovery-сценария.
  - text: технические ошибки не требуют от пользователя повторного полного ввода формы
    status: not_tested
    note: Этот UX-аспект пока не подтверждён отдельным bug report или execution note.
publishedAt: 2026-04-24
---
