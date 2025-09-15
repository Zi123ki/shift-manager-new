# 🚀 הפעלה מקומית - Local Development

## הפעלה מיידית:

```bash
# הפעל מהתיקייה הראשית:
cd /Users/zvikaist/Public/shift-manager

# הפעל את האפליקציה:
npm run dev
```

## או בנפרד:

```bash
# הפעל מתיקיית האפליקציה:
cd apps/web
npm run dev
```

## האפליקציה תהיה זמינה ב:
- **URL:** http://localhost:5173
- **פרטי התחברות:**
  - שם משתמש: `zvika`
  - סיסמה: `Zz321321`

## אם יש בעיות:
```bash
# נקה ותתקן dependencies:
cd apps/web
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## הפעלת build מקומי:
```bash
npm run build
npm run preview
```

זה יפתח את האפליקציה בדרך שדומה לפרודקשן.

## 🎯 מה עובד:
- ✅ מצב הדגמה מלא
- ✅ התחברות עובדת
- ✅ ממשק מקצועי ונקי
- ✅ תמיכת RTL בעברית
- ✅ ריספונסיבי למובייל