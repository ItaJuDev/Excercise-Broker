# Woxa — Full Stack Take-Home

โปรเจคเว็บแอปสำหรับจัดการข้อมูล Broker (โบรกเกอร์) ประกอบด้วย 3 หน้าหลักคือ หน้ารายการ, หน้าสร้างใหม่ และหน้ารายละเอียด พร้อม REST API ที่รองรับการค้นหาและกรองข้อมูล รันได้ด้วยคำสั่งเดียวผ่าน Docker

---

## ภาพรวมโปรเจค

เว็บแอปนี้ให้ผู้ใช้สามารถ:

- ดูรายการโบรกเกอร์ทั้งหมด พร้อมค้นหาและกรองตามประเภท
- สร้างโบรกเกอร์ใหม่ผ่านฟอร์ม (มีการ validate ข้อมูล)
- ดูรายละเอียดของโบรกเกอร์แต่ละราย (มี SEO meta tags)

ฝั่ง Browser จะคุยกับ Next.js (พอร์ต 3000) เท่านั้น แล้ว Next.js จะ proxy คำขอ `/api/*` ไปที่ NestJS (พอร์ต 3001) อีกที ทำให้ไม่มีปัญหาเรื่อง CORS และไม่เปิดเผย API URL ออกไปฝั่ง client

```
Browser ──► Next.js (:3000) ──proxy──► NestJS (:3001) ──► Postgres (:5432)
```

---

## Tech Stack

| ส่วน      | เทคโนโลยี                                           |
| --------- | --------------------------------------------------- |
| Frontend  | Next.js 15 (App Router) + Tailwind CSS + TypeScript |
| Backend   | NestJS 11 + Prisma + class-validator + Swagger      |
| Database  | PostgreSQL 16                                       |
| Container | Docker + docker compose                             |
| Monorepo  | npm workspaces                                      |

---

## วิธีใช้งานแบบเร็วที่สุด (แนะนำ — ใช้ Docker)

ต้องมี Docker Desktop ติดตั้งไว้ก่อน จากนั้นรันคำสั่งเดียว:

```bash
docker compose up -d --build
```

ตัว API container จะ apply Prisma migration และ seed ข้อมูลตัวอย่าง 5 รายการให้อัตโนมัติในรอบแรก

เปิดใช้งานได้ที่:

- เว็บแอป: http://localhost:3000
- API: http://localhost:3001/api/brokers
- Swagger UI (ทดลองยิง API ได้): http://localhost:3001/api/docs

หยุดการทำงาน:

```bash
docker compose down            # หยุดแต่เก็บข้อมูลไว้
docker compose down -v         # หยุดและลบข้อมูล database ทิ้ง
```

---

## วิธีใช้งานแบบ Local Dev (ไม่ใช้ Docker)

ต้องมี Node 20+, npm 10+ และ Postgres ที่รันอยู่

### 1. เปิด Postgres ขึ้นมา (ใช้แค่ db service จาก compose ก็ได้)

```bash
docker compose up -d db
```

### 2. ติดตั้ง dependencies

คำสั่งเดียวที่ root จะ install ให้ทั้ง api และ web (npm workspaces):

```bash
npm install
```

### 3. ตั้งค่า environment

```bash
cp .env.example .env
cp .env apps/api/.env
```

ตรวจสอบให้ `DATABASE_URL` ชี้ไปที่ Postgres ที่รันอยู่

### 4. สร้าง schema และ seed ข้อมูล

```bash
npm run db:migrate     # สร้างตาราง
npm run db:seed        # ใส่ข้อมูลตัวอย่าง 5 รายการ
```

### 5. รันโปรเจค (api + web พร้อมกัน)

```bash
npm run dev
```

- เว็บ: http://localhost:3000
- API: http://localhost:3001/api
- Docs: http://localhost:3001/api/docs

---

## คำสั่งที่ใช้บ่อย

```bash
npm run dev           # รัน api + web พร้อมกันใน dev mode
npm run build         # build ทั้งสอง apps
npm run db:migrate    # apply Prisma migrations
npm run db:generate   # regenerate Prisma client
npm run db:seed       # seed ข้อมูลตัวอย่าง
```

---

## API Reference (สรุปสั้นๆ)

Base URL: `http://localhost:3001/api`

| Method | Path                     | คำอธิบาย                                                            |
| ------ | ------------------------ | ------------------------------------------------------------------- |
| `GET`  | `/brokers?search=&type=` | ลิสต์โบรกเกอร์ ค้นหาด้วยชื่อ + กรองตาม type (cfd/bond/stock/crypto) |
| `GET`  | `/brokers/:slug`         | ดูรายละเอียดโบรกเกอร์ตาม slug                                       |
| `POST` | `/brokers`               | สร้างโบรกเกอร์ใหม่ (validate ครบทุก field)                          |

ลองยิง API แบบ interactive ได้ที่ Swagger UI: **http://localhost:3001/api/docs**

---

## โครงสร้างโปรเจค

```
.
├── apps/
│   ├── api/                  # NestJS + Prisma backend
│   └── web/                  # Next.js 15 App Router frontend
├── docker-compose.yml
├── package.json              # npm workspaces root
├── .env.example
├── README.md                 # ← ไฟล์นี้
└── SEO.md                    # อธิบายเรื่อง SEO ของแอปนี้
```

---

## Environment Variables

| ชื่อ               | ค่า default                                                          | ใช้โดย                          |
| ------------------ | -------------------------------------------------------------------- | ------------------------------- |
| `DATABASE_URL`     | `postgresql://broker:broker@localhost:5432/broker?schema=public`     | API (Prisma)                    |
| `API_PORT`         | `3001`                                                               | API                             |
| `WEB_ORIGIN`       | `http://localhost:3000`                                              | API CORS allow-list             |
| `API_URL_INTERNAL` | `http://localhost:3001/api` (local) / `http://api:3001/api` (Docker) | Web (proxy + server components) |

---

## ฟีเจอร์เสริมที่ใส่มาให้

- **Debounced search** — หน่วงการค้นหา 400ms กันยิง API บ่อยเกิน
- **Server-side validation** — ใช้ `class-validator` เช็คทุก field, slug ซ้ำคืน 409
- **SEO meta tags** บนหน้ารายละเอียด — ดูเพิ่มที่ [SEO.md](./SEO.md)
- **Docker compose** — รันทั้งระบบด้วยคำสั่งเดียว
- **Swagger / OpenAPI** — เอกสาร API auto-generate ที่ `/api/docs`
