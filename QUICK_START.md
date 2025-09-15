# ⚡ התחלה מהירה - Quick Start

## 🚀 פריסה לפרודקשן ב-3 שלבים

### שלב 1: הכנת הסביבה
```bash
# התקן wrangler אם לא מותקן
npm install -g wrangler

# התחבר ל-Cloudflare
wrangler auth login
```

### שלב 2: העלאה ל-GitHub
1. צור repository חדש ב-GitHub בשם `shift-manager`
2. הפעל:
```bash
git init
git remote add origin https://github.com/YOUR-USERNAME/shift-manager.git
```

### שלב 3: פריסה אוטומטית
```bash
# הפעל סקריפט הפריסה
./scripts/deploy.sh
```

הסקריפט יבצע:
- ✅ יצירת D1 Database
- ✅ הפעלת Migrations
- ✅ Build הפרויקט
- ✅ Git commit ו-push
- ✅ פריסה ל-Cloudflare Pages

## 🏠 פיתוח מקומי

```bash
# הכנת סביבה מקומית
./scripts/setup-local.sh

# הפעלה (2 טרמינלים)
npm run dev      # Frontend: localhost:3000
npm run dev:api  # API: localhost:8787
```

## 🔐 פרטי התחברות

```
Username: zvika
Password: Zz321321
```

> ⚠️ **חשוב**: החלף את הסיסמה מיד!

## ✅ בדיקת הפריסה

```bash
# בדיקה אוטומטית
./scripts/verify-deployment.sh
```

## 📱 תאימות מובייל

האפליקציה מותאמת מלאה לניידים:
- ✅ תפריט המבורגר
- ✅ כפתורים בגודל מתאים למגע (44px)
- ✅ עיצוב ריספונסיבי
- ✅ תמיכת RTL בעברית

## 🎯 בעיות נפוצות

### "wrangler not found"
```bash
npm install -g wrangler
```

### "Database ID missing"
עדכן `wrangler.toml` עם ה-database_id שהתקבל

### "Build failed"
```bash
npm install
npm run build
```

### "Login not working"
בדוק שהגדרת ב-Cloudflare Pages:
1. Environment Variables: `SESSION_SECRET`
2. D1 Binding: `DB` → `shift_manager_db`

## 📚 מסמכים נוספים

- [`README.md`](README.md) - מדריך מלא
- [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) - פרטי פריסה
- [`MOBILE_UPDATES.md`](MOBILE_UPDATES.md) - שינויי מובייל
- [`PROJECT_SUMMARY.md`](PROJECT_SUMMARY.md) - סיכום טכני

## 🆘 עזרה

אם יש בעיות:
1. בדוק logs ב-Cloudflare Pages Dashboard
2. פתח Browser Console (F12) לשגיאות
3. צור Issue ב-GitHub

**מזל טוב! האפליקציה שלך מוכנה לשימוש! 🎉**