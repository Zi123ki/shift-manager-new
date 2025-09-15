# מערכת ניהול משמרות - Shift Manager

מערכת מתקדמת לניהול משמרות עם תמיכה ב-Multi-Tenant, גרירה ושחרור, ומיתוג מותאם אישית.

## תכונות עיקריות

- 📅 **לוח שנה אינטראקטיבי** - תצוגת שבוע וחודש עם יכולות גרירה ושחרור
- 👥 **ניהול משתמשים ועובדים** - מערכת הרשאות מתקדמת (ADMIN, MANAGER, EMPLOYEE)
- 🏢 **Multi-Tenant** - תמיכה בחברות מרובות עם הפרדה מלאה
- 🎨 **White-Label** - מיתוג מותאם אישית לכל חברה
- 📊 **דוחות וייצוא** - ייצוא ל-Excel/CSV ול-PDF
- 🌐 **רב-לשוני** - תמיכה בעברית ואנגלית עם RTL
- 🔐 **אבטחה מתקדמת** - הצפנת סיסמאות, סשנים מאובטחים, ו-RBAC

## מבנה הפרויקט

```
shift-manager/
├── apps/
│   ├── web/                 # React Frontend (Vite + TypeScript)
│   └── api/                 # Cloudflare Workers API (Hono)
├── packages/
│   ├── db/                  # Database Schema & Migrations (Drizzle)
│   └── ui/                  # Shared UI Components
├── wrangler.toml            # Cloudflare Configuration
└── package.json             # Monorepo Configuration
```

## דרישות מערכת

- **Node.js** 20.0.0 או גבוה יותר
- **npm** או **pnpm**
- **wrangler** CLI מותקן גלובלית
- חשבון **Cloudflare** (לפריסה בענן)

## 🚀 התקנה והפעלה מהירה

### דרך מהירה - סקריפט אוטומטי
```bash
# הכנת סביבת פיתוח מקומית
./scripts/setup-local.sh

# פריסה לפרודקשן (לאחר הגדרת GitHub)
./scripts/deploy.sh
```

### דרך ידנית - התקנה והפעלה מקומית (macOS)

#### שלב 1: הכנת הסביבה

```bash
# התקנת wrangler CLI (אם לא מותקן)
npm install -g wrangler

# אימות התחברות ל-Cloudflare
wrangler auth login
```

#### שלב 2: שכפול והתקנת הפרויקט

```bash
# שכפול מ-GitHub (לאחר העלאה)
git clone https://github.com/YOUR-USERNAME/shift-manager.git
cd shift-manager

# התקנת dependencies עבור כל הפרויקט
npm install
```

#### שלב 3: יצירת מסד נתונים מקומי

```bash
# יצירת D1 Database
wrangler d1 create shift_manager_db

# עדכון wrangler.toml עם database_id שהתקבל
# העתק את database_id מהפלט ועדכן בקובץ wrangler.toml

# הפעלת מיגרציות
wrangler d1 migrations apply shift_manager_db --local

# הכנסת נתוני זרע (כולל משתמש Admin)
npm run db:seed
```

#### שלב 4: הפעלת הסביבה המקומית

פתח **שני טרמינלים** בתיקיית הפרויקט:

```bash
# טרמינל 1 - Frontend (React)
npm run dev

# טרמינל 2 - API (Cloudflare Workers)
npm run dev:api
```

#### שלב 5: גישה לאפליקציה

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8787

**פרטי התחברות ראשונית:**
- שם משתמש: `zvika`
- סיסמה: `Zz321321`

> ⚠️ **חשוב**: שנה את הסיסמה מיד לאחר ההתחברות הראשונה!

## 📱 תאימות מכשירים ניידים

האפליקציה מותאמת במלואה למכשירי נייד ותומכת ב:

- **עיצוב ריספונסיבי מלא** - מתאים לכל גדלי מסכים
- **תפריט המבורגר** - navigation נוח במובייל
- **מגע מותאם** - כפתורים וחלונות בגודל מתאים למגע
- **RTL Support** - תמיכה מלאה בעברית במובייל
- **Touch-friendly** - אלמנטי UI מותאמים למגע
- **PWA Ready** - מוכן להתקנה כאפליקציה במכשיר

## פריסה ל-GitHub ו-Cloudflare Pages

### שלב 1: העלאה ל-GitHub

```bash
# אתחול Git repository
git init
git add .
git commit -m "Initial commit - Shift Manager Application"

# צור repository חדש ב-GitHub והוסף אותו כ-remote
git remote add origin https://github.com/YOUR-USERNAME/shift-manager.git
git branch -M main
git push -u origin main
```

### שלב 2: הגדרת Cloudflare D1 Database (בענן)

```bash
# יצירת D1 Database בענן
wrangler d1 create shift_manager_db --remote

# הפעלת מיגרציות בענן
wrangler d1 migrations apply shift_manager_db --remote

# הכנסת נתוני זרע בענן (אופציונלי)
# יש להריץ את הסקריפט seed במידה ונדרש
```

### שלב 3: יצירת Cloudflare Pages Project

1. היכנס ל-**Cloudflare Dashboard**
2. עבור ל-**Pages** → **Create a project**
3. בחר **Connect to Git** וחבר את ה-GitHub repository
4. הגדרות Build:
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `apps/web/dist`
   - **Root directory**: (השאר ריק)

### שלב 4: הגדרת D1 Binding

1. בפרויקט ה-Pages, עבור ל-**Settings** → **Functions**
2. בקטע **D1 database bindings**, לחץ **Add binding**:
   - **Variable name**: `DB`
   - **D1 database**: בחר את `shift_manager_db`
3. שמור את ההגדרות

### שלב 5: הגדרת Environment Variables

בקטע **Environment variables**, הוסף:

```
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=production
```

### שלב 6: פריסה ראשונה

```bash
# פריסה ידנית (אופציונלי)
npm run build
wrangler pages deploy apps/web/dist

# או המתן לפריסה אוטומטית דרך Git push
git add .
git commit -m "Deploy to production"
git push origin main
```

### שלב 7: בדיקת הפריסה

1. גש לכתובת ה-Pages שהתקבלה מ-Cloudflare
2. התחבר עם: `zvika` / `Zz321321`
3. בדוק את כל התכונות:
   - יצירת חברה חדשה
   - שינוי הגדרות מיתוג
   - יצירת משמרות ועובדים
   - בדיקת גרירה ושחרור בלוח השנה
   - ייצוא נתונים

## שימוש בתכונות המתקדמות

### Multi-Tenant וWhite-Label

```javascript
// דוגמה לשינוי צבעי החברה באמצעות API
PUT /api/companies/settings
{
  "brandingJson": JSON.stringify({
    "primaryColor": "#ff6b35",
    "secondaryColor": "#2c3e50",
    "logoUrl": "https://example.com/logo.png",
    "companyName": "החברה החדשה שלי"
  })
}
```

### הוספת שדות מותאמים אישית

```javascript
// הוספת שדה חדש לעובדים
POST /api/custom-fields
{
  "entity": "employee",
  "key": "employee_id",
  "label": "מספר עובד",
  "type": "TEXT",
  "required": true
}
```

### ייצוא נתונים

```javascript
// ייצוא משמרות לחודש הנוכח
GET /api/export/csv?scope=shifts&start=2024-01-01&end=2024-01-31

// ייצוא לPDF
POST /api/export/pdf
{
  "scope": "shifts",
  "filters": {
    "departmentId": "dept_123",
    "start": "2024-01-01",
    "end": "2024-01-31"
  }
}
```

## API Documentation

### Authentication

- `POST /api/auth/login` - התחברות למערכת
- `POST /api/auth/logout` - התנתקות
- `GET /api/auth/me` - פרטי המשתמש הנוכחי
- `POST /api/auth/change-password` - שינוי סיסמה

### Companies & Settings

- `GET /api/companies/current` - פרטי החברה הנוכחית
- `PUT /api/companies/current` - עדכון פרטי חברה
- `GET/PUT /api/companies/settings` - הגדרות חברה

### Shifts Management

- `GET /api/shifts/calendar` - נתוני לוח השנה
- `GET /api/shifts` - רשימת כל המשמרות
- `POST /api/shifts` - יצירת משמרת חדשה
- `PUT /api/shifts/:id` - עדכון משמרת
- `DELETE /api/shifts/:id` - מחיקת משמרת
- `POST /api/shifts/:id/assign` - שיוך עובד למשמרת
- `DELETE /api/shift-assignments/:id` - ביטול שיוך

### הרשאות API

- **ADMIN**: גישה מלאה לכל הפונקציות
- **MANAGER**: ניהול משמרות, עובדים ואישור חופשות
- **EMPLOYEE**: צפייה בלוח הזמנים ובקשת חופשות

## פתרון בעיות נפוצות

### שגיאת התחברות לDatabase

```bash
# וודא שה-binding מוגדר נכון
wrangler d1 list

# בדוק את wrangler.toml
cat wrangler.toml | grep -A 3 "d1_databases"
```

### בעיות CORS

וודא שהכתובות בהגדרות ה-CORS כוללות את הדומיין שלך:

```javascript
// apps/api/src/index.ts
app.use("*", cors({
  origin: ["https://your-domain.pages.dev", "http://localhost:3000"],
  credentials: true,
}));
```

### בעיות RTL

```css
/* apps/web/src/index.css */
[dir="rtl"] .some-component {
  text-align: right;
  direction: rtl;
}
```

## תרומה לפרויקט

1. צור Fork של הפרויקט
2. צור branch חדש: `git checkout -b feature/amazing-feature`
3. בצע commit: `git commit -m 'Add amazing feature'`
4. דחף לbranch: `git push origin feature/amazing-feature`
5. צור Pull Request

## רישיון

פרויקט זה מוגן תחת רישיון MIT. ראה קובץ [LICENSE](LICENSE) לפרטים נוספים.

## תמיכה

לשאלות, בעיות או הצעות לשיפור:
- צור [Issue](https://github.com/YOUR-USERNAME/shift-manager/issues) חדש
- שלח דואר ל: support@your-domain.com

---

**נבנה עם ❤️ עבור קהילת הפיתוח הישראלית**

טכנולוגיות: React, TypeScript, Tailwind CSS, Cloudflare Workers, D1, Hono, Drizzle ORM