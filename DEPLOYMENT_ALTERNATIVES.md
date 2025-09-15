# 🚀 אלטרנטיבות פריסה - Deployment Alternatives

## 🚨 בעיית Cloudflare Pages
האתר https://beeedf9b.shift-manager-3iw.pages.dev/ לא עולה, מה שמצביע על בעיה ב-Cloudflare Pages.

## ✅ פתרונות זמינים:

### 1. הפעלה מקומית (מיידי)
```bash
cd /Users/zvikaist/Public/shift-manager
npm run dev
```
**זמין ב:** http://localhost:3000
**סטטוס:** ✅ עובד עכשיו

### 2. Vercel (מומלץ!)
```bash
# התקן Vercel CLI
npm install -g vercel

# פרוס מתיקיית apps/web
cd apps/web
vercel

# או פרוס מהשורש
cd /Users/zvikaist/Public/shift-manager
vercel --cwd apps/web
```

### 3. Netlify
```bash
# התקן Netlify CLI
npm install -g netlify-cli

# בנה ופרוס
npm run build
netlify deploy --prod --dir apps/web/dist
```

### 4. GitHub Pages
```bash
# התקן gh-pages
npm install -g gh-pages

# פרוס
npm run build
gh-pages -d apps/web/dist
```

### 5. תיקון Cloudflare Pages ידני

**לך ל-Cloudflare Dashboard:**
1. https://dash.cloudflare.com
2. Pages → shift-manager-3iw
3. Settings → Builds & deployments
4. **עדכן הגדרות:**
   - Build command: `npm run build`
   - Build output directory: `apps/web/dist`
   - Root directory: (ריק)
5. **צור deployment חדש:**
   - לחץ "Create deployment"
   - בחר branch: main
   - בחר commit: 1ac4fab

## 🎯 המלצה שלי:
**השתמש ב-Vercel** - זה הכי קל ומהיר ועובד מושלם עם React.

## 📞 פרטי התחברות לאפליקציה:
- שם משתמש: `zvika`
- סיסמה: `Zz321321`