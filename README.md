# QA Portfolio

Production-ready портфолио для Junior QA Engineer на `Next.js + TypeScript + Tailwind + shadcn/ui + Decap CMS`.

Проект показывает QA-артефакты из локального контента:
- проекты
- баг-репорты
- тест-кейсы
- чек-листы
- последние обновления

Контент хранится в markdown-файлах внутри репозитория. База данных не используется.

## Стек

- `Next.js 16` + App Router
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Lucide`
- `Zod`
- `Decap CMS`

## Быстрый старт

```bash
npm install
npm run dev:cms
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000).

Полезные команды:

```bash
npm run dev:cms
npm run dev
npm run lint
npm run build
npm run cms:proxy
```

## Структура проекта

```text
src/
  app/
  components/
  lib/
  types/
content/
  settings/
  projects/
  bugs/
  test-cases/
  checklists/
  updates/
public/
  admin/
  uploads/
```

Ключевые зоны:

- [src/app](C:\Users\adida\Desktop\site\src\app) — маршруты App Router и page metadata
- [src/components](C:\Users\adida\Desktop\site\src\components) — layout, shared и domain-specific компоненты
- [src/lib/content](C:\Users\adida\Desktop\site\src\lib\content) — `zod`-схемы, markdown parser, loaders и queries
- [src/types](C:\Users\adida\Desktop\site\src\types) — доменные типы и union/filter types
- [content](C:\Users\adida\Desktop\site\content) — локальный контент
- [public/admin](C:\Users\adida\Desktop\site\public\admin) — Decap CMS

## Как устроен content

Коллекции:

- [content/projects](C:\Users\adida\Desktop\site\content\projects)
- [content/bugs](C:\Users\adida\Desktop\site\content\bugs)
- [content/test-cases](C:\Users\adida\Desktop\site\content\test-cases)
- [content/checklists](C:\Users\adida\Desktop\site\content\checklists)
- [content/updates](C:\Users\adida\Desktop\site\content\updates)
- [content/settings/site.json](C:\Users\adida\Desktop\site\content\settings\site.json)

Правила контента:

- `slug` обязателен для каждой markdown-записи
- имя файла должно совпадать со `slug`: `<slug>.md`
- `frontmatter` обязателен
- markdown `body` опционален
- `project` references в bugs/test-cases/checklists должны указывать на существующий project slug

Data layer проверяет:

- `slug = filename`
- уникальность slug внутри коллекции
- обязательный frontmatter
- соответствие `zod`-схемам
- целостность ссылок на проекты

## Как добавлять контент вручную

1. Создайте файл в нужной коллекции, например `content/bugs/new-bug-slug.md`.
2. Убедитесь, что нужный `project` уже существует в [content/projects](C:\Users\adida\Desktop\site\content\projects).
3. Убедитесь, что `slug` во frontmatter равен имени файла без `.md`.
4. Заполните обязательные поля по схеме коллекции.
5. При необходимости добавьте markdown body после frontmatter.

Минимальный пример:

```md
---
title: Пример бага
slug: primer-baga
project: your-project-slug
severity: medium
priority: medium
status: open
summary: Краткое описание проблемы.
environment: Chrome 123 / Windows 11
steps:
  - Открыть страницу
  - Нажать кнопку
expected: Кнопка выполняет действие.
actual: Ничего не происходит.
screenshots: []
publishedAt: 2026-03-28
---
Дополнительные детали при необходимости.
```

## Decap CMS

CMS доступна по адресу [http://localhost:3000/admin](http://localhost:3000/admin).

Основные файлы:

- [public/admin/index.html](C:\Users\adida\Desktop\site\public\admin\index.html)
- [public/admin/config.yml](C:\Users\adida\Desktop\site\public\admin\config.yml)
- [public/admin/config.netlify-git-gateway.yml](C:\Users\adida\Desktop\site\public\admin\config.netlify-git-gateway.yml) — Netlify-вариант для production auth flow через Identity/Git Gateway

Настроены коллекции:

- `projects`
- `bugs`
- `test-cases`
- `checklists`
- `updates`
- `settings` как file collection для [content/settings/site.json](C:\Users\adida\Desktop\site\content\settings\site.json)

### Локальная работа CMS

Рекомендуемый локальный workflow:

```bash
npm run dev:cms
```

Эта команда поднимает сайт и Decap local proxy одновременно.

Если у вас уже запущен отдельный `npm run dev`, сначала остановите его. `dev:cms` ожидает, что порт `3000` свободен и поднимает весь локальный workflow сам.

Если нужен раздельный запуск, используйте:

```bash
npm run dev
npm run cms:proxy
```

Важно:

- local backend publish работает корректно, когда проект находится в git-репозитории
- если папка ещё не является репозиторием, перед первой проверкой local publish выполните `git init`
- без git-репозитория локальный publishing через proxy будет ненадёжным или недоступным
- если proxy не запущен, `/admin` корректно открывается, но Decap CMS переходит к fallback-сценарию с `Login with GitHub`
- `slug` после первой публикации лучше не менять: он влияет на URL, имя файла и стабильность связей

### Редактирование site settings

[content/settings/site.json](C:\Users\adida\Desktop\site\content\settings\site.json) редактируется через `Settings -> Site Settings` внутри CMS. Это единый источник site-wide данных для:

- SEO base settings
- navigation
- hero block
- home labels и skills
- footer content

### Что заменить перед production

Перед реальным publishing обновите [public/admin/config.yml](C:\Users\adida\Desktop\site\public\admin\config.yml):

- `backend.repo`
- `backend.branch`
- OAuth / auth-related placeholders при необходимости

Проверьте, что production deployment действительно работает с выбранным Git backend и авторизацией.

## Netlify Deploy

Для текущего проекта отдельный `netlify.toml` не добавлен. Netlify умеет определять Next.js App Router проект автоматически, поэтому лишняя конфигурация сейчас не нужна.

Рекомендуемый путь:

1. Подключите GitHub-репозиторий к Netlify.
2. Если Netlify попросит build command, укажите `npm run build`.
3. Publish directory вручную не задавайте: для Next.js deployment на Netlify она не нужна в текущем setup.
4. Запустите первый deploy и проверьте:
   - `/`
   - `/bugs`
   - `/bugs/submit-button-active-with-empty-required-field`
   - `/projects/first-learning-project`
   - `/admin`

### Decap CMS на Netlify

Локально проект продолжает использовать [public/admin/config.yml](C:\Users\adida\Desktop\site\public\admin\config.yml) с `local_backend: true` и текущим GitHub backend.

Для Netlify-friendly production setup в репозитории добавлен отдельный вариант:

- [public/admin/config.netlify-git-gateway.yml](C:\Users\adida\Desktop\site\public\admin\config.netlify-git-gateway.yml)

Если вы хотите, чтобы `/admin` на production работал через Netlify auth flow, а не через local proxy:

1. Перед deploy замените [public/admin/config.yml](C:\Users\adida\Desktop\site\public\admin\config.yml) содержимым из [public/admin/config.netlify-git-gateway.yml](C:\Users\adida\Desktop\site\public\admin\config.netlify-git-gateway.yml).
2. В Netlify откройте ваш сайт и включите `Identity`.
3. В разделе `Identity` выберите режим регистрации `Invite only` или `Open`.
4. В разделе `Services` включите `Git Gateway`.
5. При необходимости включите внешние провайдеры входа.
6. Если используете invite-only flow, убедитесь, что письма ведут на `/admin/#/...`, а не на главную.

Важно:

- `/admin` на production не использует `local proxy`; он должен работать через Netlify auth flow.
- `local_backend: true` остаётся в конфиге, чтобы не ломать локальную разработку.
- Если вы не хотите использовать Netlify Identity/Git Gateway, можете оставить GitHub backend и настроить production auth отдельно.
- Git Gateway на стороне Netlify считается устаревающим вариантом для новых setup'ов, поэтому он вынесен в отдельный opt-in config, а не заменяет локальный конфиг по умолчанию.

## Маршруты

Рабочие маршруты:

- `/`
- `/bugs`
- `/bugs/[slug]`
- `/test-cases`
- `/checklists`
- `/projects/[slug]`
- `/admin`

Статически генерируются:

- `/bugs/[slug]`
- `/projects/[slug]`

Остальные страницы:

- `/`
- `/test-cases`
- `/checklists`
- `/robots.txt`
- `/sitemap.xml`

`/bugs` остаётся динамической страницей, так как работает с query params для поиска, фильтрации и сортировки.

## Деплой на Vercel

1. Поместите проект в GitHub-репозиторий.
2. Обновите placeholders в [public/admin/config.yml](C:\Users\adida\Desktop\site\public\admin\config.yml).
3. Импортируйте репозиторий в Vercel.
4. Убедитесь, что build command — `npm run build`.
5. После деплоя проверьте:
   - публичные страницы
   - detail routes
   - `/admin`
   - Git backend auth flow для CMS

## Проверка качества

Команды проверки:

```bash
npm run lint
npm run build
```

Что уже проверено:

- `lint` проходит
- `build` проходит
- `/bugs/[slug]` и `/projects/[slug]` собираются как SSG
- `/bugs` поддерживает `q`, `severity`, `status`, `project`, `sort`
- `EmptyState` на `/bugs` работает
- прогресс чек-листов переживает reload через `localStorage`
- `/admin` открывается и загружает Decap CMS entry

## Известные caveats

- `decap-cms-app` может показывать peer warnings с React 19 при установке зависимостей, но это не ломает runtime сайта и не мешает работе `/admin`
- без запущенного local proxy CMS локально показывает fallback на GitHub login
- для production publishing нужно заменить placeholders в [public/admin/config.yml](C:\Users\adida\Desktop\site\public\admin\config.yml)
- `next build` сейчас даёт один не-блокирующий Turbopack warning, связанный с filesystem trace через sitemap/content loaders

## Готовность проекта

Проект готов как локально редактируемое QA portfolio-приложение с:

- typed content layer
- production-like UI
- SSG detail routes
- Decap CMS integration
- реальным локальным content workflow без обязательного демо-seed

Для production остаётся только инфраструктурная настройка:

- Git-репозиторий
- Decap auth/backend setup
- Vercel deployment
