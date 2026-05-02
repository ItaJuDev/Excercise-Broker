# SEO ในแอปนี้ทำงานยังไง

เอกสารนี้อธิบายว่าทำไมต้องทำ SEO, Next.js ช่วยเรื่องนี้ยังไง และไฟล์ไหนที่ต้องดู

---

## ทำไม SEO ถึงสำคัญในโปรเจคนี้

หน้า list โบรกเกอร์มีประโยชน์ก็จริง แต่หน้าที่มีคุณค่าจริงๆ สำหรับ search engine คือ **หน้ารายละเอียด** ที่ `/broker/:slug` เพราะโบรกเกอร์แต่ละรายเป็นข้อมูลเฉพาะตัว เราอยากให้ Google / Bing เก็บ index แต่ละหน้าด้วย title และ description ของตัวเอง

เป้าหมายคือ พอผู้ใช้ search คำว่า "Exness broker" บน Google ก็ให้คลิกแล้ววิ่งเข้า `/broker/exness-broker` ตรงๆ เลย

จะทำแบบนั้นได้ ต้องมี 2 อย่าง:

1. **Metadata เฉพาะของแต่ละหน้า** — ทุกหน้ารายละเอียดต้องมี `<title>` และ `<meta name="description">` ของตัวเอง ดึงมาจากข้อมูลโบรกเกอร์
2. **HTML ต้อง render มาจาก server** — bot ของ search engine ส่วนใหญ่อ่าน HTML ก่อนที่ JavaScript จะรัน ฉะนั้น metadata ต้องอยู่ใน HTML ตั้งแต่แรกแล้ว

โชคดีที่ Next.js App Router รองรับทั้ง 2 อย่างนี้ให้ฟรี เราแค่ต่อสายมันให้ถูก

---

## วิธีที่ต่อสายในโปรเจคนี้

ไฟล์หลักของหน้ารายละเอียดอยู่ที่:

```
apps/web/src/app/broker/[slug]/page.tsx
```

เป็น **server component** (ไม่มี `'use client'`) แปลว่า render เป็น HTML ที่ฝั่ง Next.js server มี 2 จุดสำคัญในไฟล์นี้:

### 1. `generateMetadata` — ฟังก์ชันที่รันบน server เพื่อสร้าง metadata

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const broker = await getBroker(slug).catch(() => null);
  if (!broker) {
    return { title: 'Broker not found', description: '...' };
  }
  const desc = broker.description.slice(0, 160);
  return {
    title: broker.name, // → <title>Exness | Woxa</title>
    description: desc, // → <meta name="description" ...>
    alternates: { canonical: `/broker/${broker.slug}` }, // → <link rel="canonical" ...>
    openGraph: {
      // → <meta property="og:..." ...>
      title: broker.name,
      description: desc,
      type: 'website',
      images: broker.logo_url ? [{ url: broker.logo_url }] : undefined,
    },
    twitter: { card: 'summary', title: broker.name, description: desc },
  };
}
```

Next.js จะเรียกฟังก์ชันนี้บน server **ก่อนส่ง HTML กลับให้ browser** ค่าที่ return จะถูกใส่เป็น tag ใน `<head>` ของ response เลย

ใน root layout (`apps/web/src/app/layout.tsx`) มีการตั้ง template ไว้:

```ts
title: { default: 'Woxa', template: '%s | Woxa' }
```

ฉะนั้นถ้าโบรกเกอร์ชื่อ "Exness" title จะกลายเป็น `<title>Exness | Woxa</title>` อัตโนมัติ

### 2. ใช้ slug เป็น URL ก็เป็น SEO ที่ดีในตัวอยู่แล้ว

เราเลือก `/broker/:slug` แทน `/broker/:id` เพราะ:

- `/broker/exness-broker` — มี keyword ในตัว, อ่านเข้าใจง่าย, แชร์ดูดี
- `/broker/42` — ไม่สื่อความหมายอะไรเลย

slug ยังไปโผล่ใน canonical URL, log, และตอนแชร์ social media ได้สวยอีกด้วย

---

## วิธีตรวจสอบว่าใช้งานได้จริง

### วิธีที่ 1 — ดู source ใน browser

1. รันแอป (`docker compose up --build`)
2. เปิด http://localhost:3000/broker/exness-broker
3. คลิกขวา → **View Page Source** (ห้ามใช้ "Inspect" เพราะมันโชว์ DOM หลัง JS รันแล้ว)
4. ใน HTML ดิบจะเห็นแบบนี้:
   ```html
   <title>Exness | Woxa</title>
   <meta name="description" content="Exness is a multi-asset broker offering CFDs ..." />
   <link rel="canonical" href="/broker/exness-broker" />
   <meta property="og:title" content="Exness" />
   <meta property="og:image" content="https://placehold.co/200x200?text=Exness" />
   ```

### วิธีที่ 2 — ใช้ curl

```bash
curl -s http://localhost:3000/broker/exness-broker | grep -E '<title>|name="description"|og:'
```

ถ้าเห็น title และ description มีชื่อกับข้อความของโบรกเกอร์จริงๆ ก็แปลว่า bot ของ Google ก็จะเห็นแบบเดียวกัน

---

## หมายเหตุเรื่อง Cache

หน้ารายละเอียดใส่ `export const dynamic = 'force-dynamic'` และ `fetch(..., { cache: 'no-store' })` ไว้ ทำให้ทุก request จะ fetch ใหม่จาก API เสมอ เพื่อความเรียบง่ายและข้อมูล fresh ตลอดในระดับการสอบ

แต่ถ้าเป็น production จริง ควรใช้ **ISR** (Incremental Static Regeneration) แทน เช่น:

```ts
export const revalidate = 60; // re-render สูงสุดนาทีละครั้งต่อ slug
```

หรือใช้ `generateStaticParams` เพื่อ pre-render ทุก slug ตั้งแต่ตอน build ก็ได้ ทั้ง 2 วิธีก็ยังคงมี metadata เฉพาะหน้าเหมือนเดิม แค่ต่างกันเรื่องความถี่ในการ rebuild เท่านั้น

---

## สรุปสั้นๆ

- หน้ารายละเอียดเป็น server component → HTML render ที่ server → bot เห็น metadata จริง
- `generateMetadata` ดึงข้อมูลโบรกเกอร์จาก slug แล้ว return `<title>`, `<meta description>`, `<link canonical>`, Open Graph และ Twitter tag เฉพาะของแต่ละโบรกเกอร์
- URL แบบ slug (`/broker/exness-broker`) ดี SEO กว่าแบบ id (`/broker/42`) อยู่แล้ว
- ตรวจสอบได้ด้วย "View Page Source" หรือ `curl` เท่านั้น อย่าใช้ DevTools (เพราะมันโชว์ DOM หลัง JS รันแล้ว)
