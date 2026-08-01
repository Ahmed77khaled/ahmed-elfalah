# تقرير التسليم والنشر على Vercel

## حالة المشروع

المشروع جاهز للبناء والنشر على Vercel. تم التحقق من TypeScript وبناء إنتاج واجهة البورتفوليو. كما تم تأمين جلسات لوحة التحكم بحيث لا تُقبل إلا رموز JWT الموقعة والصالحة.

## المتغيرات المطلوبة

أضف هذه المتغيرات من **Vercel → Project Settings → Environment Variables** قبل النشر. استخدم قيماً قوية وفريدة؛ ولا تضع القيم الحقيقية في Git أو في هذا الملف.

| المتغير | الغرض |
| --- | --- |
| `ADMIN_PASSWORD` | كلمة مرور قوية للوصول إلى لوحة التحكم |
| `SESSION_SECRET` | سلسلة عشوائية طويلة لتوقيع جلسات لوحة التحكم |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | رابط النطاق المنشور، مثل `https://your-project.vercel.app` |
| `DATABASE_URL` | رابط اتصال PostgreSQL الدائم (Neon أو Vercel Postgres أو Supabase) |

يمكن البدء من ملف `.env.example` المحلي، مع إبقاء ملف `.env` غير مرفوع إلى Git.

## إعداد النشر

- **Build Command:** `pnpm --filter @workspace/portfolio run build`
- **Output Directory:** `artifacts/portfolio/dist/public`
- **Install Command:** `pnpm install --frozen-lockfile`
- المسارات `/admin/login` و`/admin` و`/admin/dashboard` مدعومة عبر إعدادات Vercel الحالية.

## فحص ما بعد النشر

```powershell
curl.exe -i https://your-domain.vercel.app/api/projects
curl.exe -i https://your-domain.vercel.app/api/healthz
```

افتح `/admin/login` وسجل الدخول باستخدام القيمة التي وضعتها في `ADMIN_PASSWORD`، ثم تأكد من فتح لوحة التحكم.

## تهيئة قاعدة البيانات

سنستخدم **Supabase**. أنشئ مشروعاً جديداً ثم شغّل محتوى الملف `db/init.sql` مرة واحدة من SQL Editor؛ ينشئ الملف الجداول ويضيف بيانات البورتفوليو الأولية بدون الكتابة فوق البيانات الموجودة. من زر **Connect** انسخ رابط **Transaction pooler** (المنفذ `6543`) وضعه كقيمة `DATABASE_URL` في إعدادات Vercel، ثم أعد النشر. بعد ذلك كل الرسائل وتعديلات لوحة التحكم تحفظ في قاعدة البيانات بشكل دائم.
