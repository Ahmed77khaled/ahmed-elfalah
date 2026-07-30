# دليل تعديل البورتفوليو — Ahmed El-Falah

> تقدر تعدّل أي حاجة في البورتفوليو بتاعك من غير ما تفهم كود. كل البيانات موجودة في ملفات واضحة، كل اللي هتعمله هو تغيير النص أو تضيف سطر جديد.

---

## إضافة مهارة جديدة (Skill)

**الملف:** `src/components/sections/Skills.tsx`

ابحث عن اسم الـ Category اللي عايز تضيف فيها المهارة، مثلاً "Programming"، وأضف سطر جديد في الـ `skills` array:

```ts
{ name: "اسم المهارة", level: 70 },
```

- الـ `level` رقم من 0 لـ 100 بيمثل مستواك (100 = خبير، 50 = متوسط، 30 = مبتدئ)

**مثال:** إضافة Kotlin للـ Programming:
```ts
{ name: "Kotlin", level: 40 },
```

لو عايز تضيف **Category كاملة** جديدة، زوّد block جديد زي ده:
```ts
{
  title: "اسم التصنيف",
  icon: "XX",   // اختصار حرفين
  skills: [
    { name: "مهارة 1", level: 60 },
    { name: "مهارة 2", level: 50 },
  ],
},
```

---

## إضافة مشروع جديد (Project)

**الملف:** `src/components/sections/Projects.tsx`

ابحث عن `const projects: Project[] = [` وأضف object جديد جوا الـ array:

```ts
{
  id: "اسم-مميز-بدون-مسافات",         // مثلاً: "my-new-project"
  title: "اسم المشروع",
  tagline: "جملة قصيرة وصفية",
  description: "وصف تفصيلي للمشروع.",
  features: [
    "ميزة أولى",
    "ميزة تانية",
    "ميزة تالتة",
  ],
  tech: ["Python", "React", "Docker"],
  category: "Tools",                   // أو: Web / AI / Desktop / DevOps
  gradient: "linear-gradient(135deg, hsl(190 100% 50% / 0.15), hsl(262 83% 57% / 0.1))",
  demoUrl: "https://رابط-العرض.com",  // أو "#" لو مفيش
  githubUrl: "https://github.com/username/repo",
},
```

---

## إضافة صورة للمشروع

حالياً كل مشروع بيتعرض بشكل graphic مع أول حروف اسمه. لو عندك صورة حقيقية:

1. ضيف الصورة في مجلد `public/` — مثلاً: `public/projects/my-project.jpg`
2. في الـ `ProjectModal` component، استبدل الـ div الـ gradient بـ:

```tsx
<img
  src="/projects/my-project.jpg"
  alt="اسم المشروع"
  className="rounded-xl w-full object-cover"
  style={{ height: "200px" }}
/>
```

---

## إضافة إنجاز أو شهادة (Certificate/Achievement)

لو عندك صورة شهادة أو إنجاز:

1. حط الصورة في `public/certs/` — مثلاً: `public/certs/ccna.jpg`
2. فتح ملف `src/components/sections/Experience.tsx` أو ابعتلي قول "عايز أضيف شهادة" وأنا أساعدك تضيفها في أقرب section مناسبة

---

## تعديل معلوماتك الشخصية

| المعلومة | الملف |
|---|---|
| الاسم في الـ Hero | `src/components/sections/Hero.tsx` — سطر `Ahmed.` |
| البايو في الـ About | `src/components/sections/About.tsx` — الـ paragraph الأولانية |
| التايم لاين (مسيرتك) | `src/components/sections/About.tsx` — `const timelineItems` |
| الإيميل والواتساب | `src/components/sections/Contact.tsx` — `const contactInfo` |
| روابط السوشيال | `src/components/sections/Hero.tsx` و `Footer.tsx` — `const socialLinks` |
| كوبي رايت | `src/components/sections/Footer.tsx` |
| الـ meta tags / SEO | `index.html` |

---

## تغيير الأرقام في الـ Stats

**الملف:** `src/components/sections/Stats.tsx`

ابحث عن `const stats` وعدّل الأرقام أو أضف stat جديدة:

```ts
{ value: 50, suffix: "+", label: "Projects Completed" },
```

---

## الـ Testimonials (آراء العملاء)

**الملف:** `src/components/sections/Testimonials.tsx`

ابحث عن `const testimonials` وأضف أو عدّل:

```ts
{
  name: "اسم الشخص",
  role: "وظيفته",
  company: "اسم الشركة",
  quote: "رأيه فيك.",
  initials: "AB",
},
```

---

## نصائح سريعة

- **الـ `level`** في المهارات: 25 = بتتعلم دلوقتي، 50 = متوسط، 75 = جيد، 90+ = محترف
- **الـ `gradient`** في المشاريع: غيّر الأرقام لتغيير اللون — `190` = سيان، `262` = بنفسجي
- بعد أي تعديل، الموقع بيتحدث تلقائي في الـ preview (Vite hot reload)
- لو عايز مساعدة في أي تعديل، قولي بالظبط إيه اللي عايز تضيفه وأنا أعمله

---

*آخر تحديث: July 2026*
