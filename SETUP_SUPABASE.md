# Як налаштувати Supabase для SimuHub AI

## Варіант 1: Через веб-інтерфейс (Рекомендовано)

### Крок 1: Створіть проект у Supabase

1. Перейдіть на [supabase.com](https://supabase.com)
2. Увійдіть або створіть обліковий запис
3. Натисніть "New Project"
4. Заповніть інформацію про проект:
   - Database Password (збережіть цей пароль!)
   - Region (виберіть найближчий)
   - Натисніть "Create new project"

### Крок 2: Виконайте SQL схему

1. Відкрийте свій проект у Supabase Dashboard
2. У лівій панелі натисніть **SQL Editor**
3. Натисніть **New query** (або просто відкрийте редактор)
4. Відкрийте файл `supabase-schema.sql` з цього проекту
5. Скопіюйте весь вміст файлу
6. Вставте в SQL Editor у Supabase
7. Натисніть **Run** (або `Ctrl+Enter` / `Cmd+Enter`)

### Крок 3: Отримайте ключі API

1. У лівій панелі натисніть **Settings** (⚙️)
2. Перейдіть у розділ **API**
3. Скопіюйте:
   - **Project URL** → це буде `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** ключ → це буде `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Додайте їх у ваш `.env.local` файл

### Крок 4: Налаштуйте Site URL (КРИТИЧНО для email підтвердження!)

1. У лівій панелі натисніть **Authentication**
2. Перейдіть у розділ **URL Configuration**
3. У полі **Site URL** вкажіть:
   - Для локальної розробки: `http://localhost:3000`
   - Для продакшену (Vercel): `https://your-app.vercel.app` (замініть на ваш реальний URL)
4. У полі **Redirect URLs** додайте (можна кілька через кому):
   - `http://localhost:3000/auth/callback`
   - `https://your-app.vercel.app/auth/callback` (замініть на ваш реальний URL)
5. Натисніть **Save**

**Важливо:** Без правильного налаштування Site URL, email з підтвердженням буде містити посилання на localhost навіть на Vercel!

### Крок 5: Налаштуйте Google OAuth (опціонально)

1. У лівій панелі натисніть **Authentication**
2. Перейдіть у розділ **Providers**
3. Знайдіть **Google** та увімкніть його
4. Додайте:
   - **Client ID** (з Google Cloud Console)
   - **Client Secret** (з Google Cloud Console)
5. Додайте Redirect URL:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Для локальної розробки: `http://localhost:3000/auth/callback`

---

## Варіант 2: Через Supabase CLI

### Встановлення CLI

```bash
# macOS
brew install supabase/tap/supabase

# або через npm
npm install -g supabase
```

### Логін та підключення

```bash
# Увійдіть у Supabase
supabase login

# Ініціалізуйте проект (якщо ще не зроблено)
supabase init

# Підключіться до вашого проекту
supabase link --project-ref your-project-ref
```

### Виконайте SQL схему

```bash
# З вашої директорії проекту
supabase db execute --file supabase-schema.sql
```

Або через psql напряму:

```bash
# Отримайте connection string з Supabase Dashboard > Settings > Database
# Потім виконайте:
psql "your-connection-string" -f supabase-schema.sql
```

---

## Перевірка правильності налаштування

Після виконання SQL схеми перевірте:

1. **Таблиця створена:**

   - У Supabase Dashboard > Table Editor
   - Має бути таблиця `simulations`

2. **RLS увімкнено:**

   - У Table Editor > simulations > Policies
   - Мають бути створені політики

3. **Індекси створені:**
   - У SQL Editor виконайте:
   ```sql
   SELECT indexname FROM pg_indexes
   WHERE tablename = 'simulations';
   ```
   - Мають бути видимі індекси

---

## Налаштування для Vercel (Production)

### Змінні оточення на Vercel:

1. Перейдіть у ваш проект на Vercel
2. Відкрийте **Settings** → **Environment Variables**
3. Додайте наступні змінні:
   - `NEXT_PUBLIC_SUPABASE_URL` = ваш Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ваш Supabase anon key
   - `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app` (ваш URL на Vercel)
   - `OPENAI_API_KEY` = ваш OpenAI API ключ (якщо використовується)

**Важливо:** Після додавання змінних оточення, перезапустіть deployment на Vercel!

## Примітки

- Зберігайте ваш Database Password в безпечному місці
- `anon` ключ безпечний для використання на клієнті
- `service_role` ключ НІКОЛИ не використовуйте на клієнті (тільки на сервері)
- Після створення таблиці автоматично активуються Row Level Security (RLS)
- **Site URL в Supabase має відповідати вашому production URL** - це критично для правильної роботи email підтвердження!
