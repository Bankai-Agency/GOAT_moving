# Админка сайта (`/admin`)

Панель управления контентом: тексты, картинки, повторяющиеся элементы
(отзывы, FAQ, карточки услуг, города, лендинги). Устроена так&nbsp;же, как
в&nbsp;проекте sosmoving: контент лежит в&nbsp;репозитории, а&nbsp;сохранение
из&nbsp;админки на&nbsp;проде - это коммит + автосборка Vercel.

## Как устроен контент

- `src/content/*.json` - весь редактируемый контент. Компоненты сайта читают
  его через `@/lib/content` (статический импорт, попадает в&nbsp;сборку).
- `src/lib/admin/documents.ts` - реестр документов и&nbsp;схема полей для
  каждого. Чтобы сделать новое поле редактируемым: добавьте его в&nbsp;JSON,
  в&nbsp;тип (`src/lib/content/types.ts`), в&nbsp;схему документа и&nbsp;прочитайте
  в&nbsp;компоненте.
- Иконки для списков (What's Included, шаги, отрасли и&nbsp;т.&nbsp;п.) -
  реестр `src/lib/content/icons.tsx`; в&nbsp;JSON хранится имя иконки.
- Загруженные файлы - `public/images/uploads/`.

Документы: «Контакты и&nbsp;общие данные» (телефон, email, адреса, рейтинги,
футер), «Общие блоки», главная, 4 страницы услуг, отзывы, FAQ, контакты,
города (`/{city}-movers`) и&nbsp;лендинги (`/lp/movers-…`). Города
и&nbsp;лендинги - коллекции: можно добавлять и&nbsp;удалять элементы.

## Локальный запуск

1. `cp .env.example .env.local`, задайте `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
2. `npm run dev`, откройте `http://localhost:3000/admin`.
3. Правки пишутся прямо в&nbsp;файлы проекта и&nbsp;сразу видны на&nbsp;dev-сервере.
   Дальше их&nbsp;коммитите как обычно.

## Прод (Vercel)

Переменные окружения (Settings → Environment Variables):

| Переменная | Зачем |
| --- | --- |
| `AUTH_SECRET` | подпись сессии, `openssl rand -base64 32` (обязательно) |
| `GITHUB_TOKEN` | fine-grained PAT только на&nbsp;этот репозиторий, Contents: Read and write |
| `GITHUB_REPO` | `Bankai-Agency/GOAT_moving` |
| `GITHUB_BRANCH` | `main` |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | вход без базы (один владелец) |
| `DATABASE_URL` | Neon Postgres, если нужно несколько редакторов |

С&nbsp;`GITHUB_TOKEN` каждое сохранение - коммит в&nbsp;репозиторий, Vercel
пересобирает сайт (~2-3 минуты). Галочка «Сохранить без публикации»
помечает коммит `[skip deploy]`; `vercel.json` → `ignoreCommand`
пропускает сборку таких коммитов, а&nbsp;кнопка «Опубликовать накопленное»
делает пустой коммит и&nbsp;запускает одну сборку на&nbsp;всё сразу.

Лимит загрузки файла - 4&nbsp;MB (ограничение тела запроса на&nbsp;Vercel):
большие фото стоит сжать перед загрузкой.

## Несколько редакторов (база пользователей)

1. Создайте базу Neon (Vercel → Storage → Postgres) и&nbsp;задайте `DATABASE_URL`.
2. `npm run db:setup` - создаёт таблицы `users` и&nbsp;`invites`.
3. `npm run db:seed` - создаёт владельца из&nbsp;`SEED_USERNAME` / `SEED_PASSWORD`
   (при первом входе попросит сменить пароль).
4. Дальше - раздел «Пользователи»: приглашения по&nbsp;ссылке (7 дней),
   сброс пароля, до&nbsp;5 редакторов.

Когда `DATABASE_URL` задан, `ADMIN_USERNAME` / `ADMIN_PASSWORD` не&nbsp;используются.
