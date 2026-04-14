---
title: AGIMA / Главная страница / Mobile smoke & exploratory checklist
slug: agima-homepage-mobile-smoke-exploratory-checklist
project: qamanual
category: AGIMA / Homepage / Mobile
description: Чек-лист для smoke и exploratory проверки мобильной версии главной страницы AGIMA.
items:
  - text: логотип отображается корректно
    status: not_tested
    note: Для логотипа пока нет отдельного test case или bug report.
  - text: бургер-меню видно и кликабельно
    status: not_tested
    note: Этот пункт пока не покрыт отдельным сценарием.
  - text: первый экран не обрезан
    status: not_tested
    note: Явный дефект первого экрана не зафиксирован отдельным артефактом.
  - text: текст не выходит за границы контейнеров
    status: not_tested
    note: Отдельной проверки на текстовый overflow пока нет.
  - text: контент отображается корректно сразу после загрузки
    status: failed
    evidence:
      - AGIMA-TC-005
      - "BUG: homepage-mobile-content-block-initializes-only-after-scroll"
    note: Контентный блок доинициализируется только после scroll.
  - text: блоки не зависят от первого scroll для доинициализации
    status: failed
    evidence:
      - AGIMA-TC-005
      - "BUG: homepage-mobile-content-block-initializes-only-after-scroll"
    note: Найден явный дефект зависимости от первого scroll.
  - text: нет явных пустых зон вместо контента
    status: failed
    evidence:
      - AGIMA-TC-005
      - "BUG: homepage-mobile-content-block-initializes-only-after-scroll"
    note: До первого scroll часть контентного блока отображается некорректно.
  - text: lazy-loaded блоки появляются корректно
    status: failed
    evidence:
      - AGIMA-TC-005
      - "BUG: homepage-mobile-content-block-initializes-only-after-scroll"
    note: Инициализация lazy-блока подтверждённо привязана к scroll.
  - text: заголовки читаемы
    status: not_tested
    note: Отдельного кейса на типографику заголовков пока нет.
  - text: строки текста не наезжают друг на друга
    status: not_tested
    note: Этот пункт пока не подтверждён отдельной проверкой.
  - text: карточки не выходят за ширину экрана
    status: not_tested
    note: Нет отдельного артефакта по карточкам и width overflow.
  - text: горизонтальный скролл отсутствует
    status: not_tested
    note: Пункт пока не покрыт отдельным сценарием.
  - text: счётчики отображаются корректно
    status: failed
    evidence:
      - AGIMA-TC-006
      - "BUG: mobile-counter-overlaps-label-during-animation"
    note: Во время анимации счётчик отображается нестабильно.
  - text: цифры не перекрывают подписи
    status: failed
    evidence:
      - AGIMA-TC-006
      - "BUG: mobile-counter-overlaps-label-during-animation"
    note: Зафиксировано наложение числа на подпись справа.
  - text: анимации не ломают layout
    status: failed
    evidence:
      - AGIMA-TC-006
      - "BUG: mobile-counter-overlaps-label-during-animation"
    note: Анимация счётчика приводит к визуальной поломке layout.
  - text: элементы после анимации остаются в правильной позиции
    status: not_tested
    note: Есть наблюдение, что после анимации блок может выглядеть лучше, но отдельный стабильный результат не зафиксирован.
  - text: меню открывается и закрывается
    status: not_tested
    note: Для этого поведения пока нет отдельного test case.
  - text: ссылки в карточках кликабельны
    status: not_tested
    note: Пункт не покрыт отдельным артефактом.
  - text: CTA-кнопки нажимаются
    status: not_tested
    note: Пока нет отдельной проверки по CTA-кнопкам на мобильной версии.
  - text: переходы по основным ссылкам работают
    status: not_tested
    note: Отдельный smoke case на навигацию ещё не оформлен.
  - text: изображения загружаются корректно
    status: not_tested
    note: Нет отдельной проверки по изображениям.
  - text: видео или превью не ломают верстку
    status: not_tested
    note: Пункт пока не покрыт тест-кейсом или багом.
  - text: медиа адаптированы под mobile width
    status: not_tested
    note: Для медиаадаптации пока нет отдельного подтверждённого результата.
  - text: ссылки в футере читаемы
    status: not_tested
    note: Этот пункт ещё не покрыт отдельной проверкой.
  - text: футер не ломается на мобильной ширине
    status: not_tested
    note: Для футера нет отдельного артефакта.
  - text: контакты и навигация доступны
    status: not_tested
    note: Пункт требует отдельного smoke прохода по навигации и контактам.
publishedAt: 2026-04-14
---
