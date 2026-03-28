# Sergey Kikot | QA Portfolio

Портфолио Junior QA Engineer с практикой ручного тестирования. Проект показывает реальные QA-артефакты: баг-репорты, тест-кейсы, чек-листы и обновления по учебным и pet-проектам.

Сайт собран на `Next.js`, хранит контент локально в markdown и управляется через `Decap CMS`, чтобы новые записи можно было добавлять без правки кода.

## Что внутри

- каталог баг-репортов с поиском, фильтрацией и сортировкой
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

## Decap CMS

Основные файлы CMS:

- [public/admin/index.html](C:\Users\adida\Desktop\site\public\admin\index.html)
- [public/admin/config.yml](C:\Users\adida\Desktop\site\public\admin\config.yml)
- [public/admin/config.netlify-git-gateway.yml](C:\Users\adida\Desktop\site\public\admin\config.netlify-git-gateway.yml)

Локально CMS работает через `local_backend: true`, поэтому для publish нужен git-репозиторий и запущенный proxy. Если proxy не поднят, `/admin` откроется, но Decap переключится на fallback-сценарий с GitHub login.

## Deploy

### Netlify

Для текущего проекта `netlify.toml` не нужен: Netlify умеет подхватывать Next.js автоматически.

Если Netlify запросит настройки вручную:

- build command: `npm run build`
- publish directory: не задавать вручную

Для production CMS на Netlify можно использовать отдельный вариант [public/admin/config.netlify-git-gateway.yml](C:\Users\adida\Desktop\site\public\admin\config.netlify-git-gateway.yml) и включить `Identity + Git Gateway` в Netlify UI.

### Vercel

Проект также совместим с Vercel. Достаточно подключить GitHub-репозиторий и использовать `npm run build`.

## Проверка

```bash
npm run lint
npm run build
```

## Контакты

- Email: [sergeykikot.qa@gmail.com](mailto:sergeykikot.qa@gmail.com)
- Telegram: [@SergeykikotQa](https://t.me/SergeykikotQa)
- GitHub: [sergeykikotqa](https://github.com/sergeykikotqa)
