# Sergey Kikot | QA Portfolio

Портфолио Junior QA Engineer с практикой ручного тестирования. Проект показывает реальные QA-артефакты: баг-репорты, тест-кейсы, чек-листы и обновления по учебным и pet-проектам.

Сайт собран на `Next.js`, хранит контент локально в markdown и управляется через `Decap CMS`, чтобы новые записи можно было добавлять без правки кода.

## Что внутри

- каталог баг-репортов с поиском, фильтрацией и сортировкой
- build-time синхронизация GitHub Issues в отдельную managed-директорию
- детальные страницы багов со steps, expected/actual result и вложениями
- тест-кейсы и чек-листы, сгруппированные по проектам и категориям
- страница проекта с агрегированными QA-артефактами
- `/admin` для управления контентом через Decap CMS

## Стек

- `Next.js 16` + App Router
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Zod`
- `Decap CMS`

## Локальный запуск

```bash
npm install
npm run dev:cms
```

После запуска:

- сайт: [http://localhost:3000](http://localhost:3000)
- админка: [http://localhost:3000/admin](http://localhost:3000/admin)

Если нужен только сайт:

```bash
npm run dev
```

Если нужен раздельный запуск CMS:

```bash
npm run dev
npm run cms:proxy
```

## Контент

Контент хранится в репозитории:

- [content/projects](C:\Users\adida\Desktop\site\content\projects)
- [content/bugs](C:\Users\adida\Desktop\site\content\bugs)
- [content/bugs-synced](C:\Users\adida\Desktop\site\content\bugs-synced)
- [content/bug-overrides](C:\Users\adida\Desktop\site\content\bug-overrides)
- [content/test-cases](C:\Users\adida\Desktop\site\content\test-cases)
- [content/checklists](C:\Users\adida\Desktop\site\content\checklists)
- [content/updates](C:\Users\adida\Desktop\site\content\updates)
- [content/settings/site.json](C:\Users\adida\Desktop\site\content\settings\site.json)

Правила простые:

- у каждой markdown-записи должен быть `slug`
- имя файла должно совпадать со `slug`: `<slug>.md`
- `frontmatter` обязателен
- markdown `body` опционален
- баги, тест-кейсы и чек-листы должны ссылаться на существующий `project` slug
- проект нельзя удалять, пока к нему привязаны bugs, test-cases или checklists
- `content/bugs-synced` полностью управляется sync-скриптом и не предназначен для ручного редактирования
- `content/bug-overrides/*.json` содержит только presentation-override для synced bugs

## Decap CMS

Основные файлы CMS:

- [public/admin/index.html](C:\Users\adida\Desktop\site\public\admin\index.html)
- [public/admin/config.yml](C:\Users\adida\Desktop\site\public\admin\config.yml)
- [public/admin/config.netlify-git-gateway.yml](C:\Users\adida\Desktop\site\public\admin\config.netlify-git-gateway.yml)

Локально CMS работает через `local_backend: true`, поэтому для publish нужен git-репозиторий и запущенный proxy. Если proxy не поднят, `/admin` откроется, но Decap переключится на fallback-сценарий с GitHub login.

## Проверка зависимостей проекта

Перед удалением проекта запустите:

```bash
npm run content:deps
```

Команда проходит по всем проектам и показывает:

- какие проекты свободны
- какие проекты заблокированы связанными сущностями
- какие `bugs`, `test-cases` и `checklists` мешают безопасному удалению

## GitHub Issues Sync

Для подтягивания багов из `sergeykikotqa/qa-practice` используйте:

```bash
$env:GITHUB_TOKEN="your-token"
npm run sync:issues
```

Dry-run без записи файлов:

```bash
$env:GITHUB_TOKEN="your-token"
npm run sync:issues -- --dry-run
```

Опционально можно переопределить исходный репозиторий:

```bash
$env:GITHUB_TOKEN="your-token"
$env:GITHUB_ISSUES_REPO="owner/repo"
npm run sync:issues
```

Скрипт:

- синхронизирует только issues с labels `bug`, `portfolio`, `project:*`, `severity:*`
- пересобирает только `content/bugs-synced`
- прерывает запись, если находит hard error в labels, template или managed-директории

## Deploy To GitHub Pages

Проект подготовлен под GitHub Pages для репозитория `qa-portfolio`.

Production URL:

- [https://sergeykikotqa.github.io/qa-portfolio/](https://sergeykikotqa.github.io/qa-portfolio/)

Workflow:

1. Добавить или обновить контент локально через CMS.
2. Закоммитить изменения и сделать `git push`.
3. Собрать статический экспорт:

```bash
npm run build
```

4. Опубликовать содержимое `out` в ветку `gh-pages`:

```bash
npm run deploy
```

Что делает конфиг:

- production build использует `basePath` и `assetPrefix` = `/qa-portfolio`
- `out/.nojekyll` добавляется автоматически через `public/.nojekyll`, чтобы GitHub Pages корректно раздавал `_next`
- detail routes для багов и проектов экспортируются как статические директории с `index.html`

Что проверить после первого деплоя:

- открывается главная по URL репозитория
- работают `/bugs/` и `/projects/qamanual/`
- favicon, стили и шрифты загружаются с `/qa-portfolio/_next/...`
- `robots.txt`, `sitemap.xml` и OG image указывают на GitHub Pages URL

## CMS в production

`/admin` продолжает экспортироваться как статическая страница и доступен в `out/admin/index.html`, но на GitHub Pages это не рабочий production backend для CMS.

Рабочий сценарий такой:

- локально: [http://localhost:3000/admin](http://localhost:3000/admin)
- локально через `npm run dev:cms`
- publish контента идёт локально, затем изменения коммитятся в git и пушатся в репозиторий

На GitHub Pages `/admin` можно открыть как статическую страницу, но без локального proxy и backend workflow он не предназначен для реального редактирования контента.

## Проверка

```bash
npm run lint
npm run build
```

## Контакты

- Email: [sergeykikot.qa@gmail.com](mailto:sergeykikot.qa@gmail.com)
- Telegram: [@SergeykikotQa](https://t.me/SergeykikotQa)
- GitHub: [sergeykikotqa](https://github.com/sergeykikotqa)
