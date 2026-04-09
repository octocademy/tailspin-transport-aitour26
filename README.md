# ⚡ Tailspin Transport

**Premium electric vehicles engineered for the future.**

Tailspin Transport is a modern e-commerce showcase for electric vehicles — from compact commuters to high-performance supercars. Built with Next.js and designed with a clean, futuristic aesthetic, this project demonstrates production-quality patterns for full-stack TypeScript development.

---

## ✨ Features

- 🎨 **Modern UI with futuristic vibes** – Clean design with electric blue and teal accents
- 🧩 **shadcn/ui components** – Built on top of accessible, composable UI primitives
- 🗄️ **SQLite + Prisma** – Simple, dev-friendly database with type-safe ORM
- 🎯 **TypeScript everywhere** – Full type safety from database to UI
- 📱 **Responsive design** – Beautiful on mobile, tablet, and desktop
- ⚡ **Next.js 16 App Router** – Modern React patterns with server components

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/octodemo/tailspin-transport-aitour26.git
cd tailspin-transport
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy the example env file
cp .env.example .env
```

4. **Set up the database**

```bash
# Reset database, run migrations, and seed with sample vehicle data
npx prisma migrate reset --force
```

This command will:
- Create the SQLite database (`dev.db`)
- Apply all migrations
- Automatically run the seed script to populate sample vehicles

5. **Run the development server**

```bash
npm run dev
```

6. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000) to see the app in action.

---

## 🔧 Quick Start (One Command)

If you want to get up and running quickly:

```bash
npm install && cp .env.example .env && npx prisma migrate reset --force && npm run dev
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible component primitives |
| **Prisma** | Type-safe database ORM |
| **SQLite** | Lightweight, file-based database |
| **Lucide React** | Modern icon library |

---

## 📂 Project Structure

```
tailspin-transport/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Sample data seeder
│   └── migrations/        # Database migrations
├── public/
│   └── images/
│       └── products/      # Vehicle images
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── vehicles/
│   │       └── page.tsx   # Vehicles listing page
│   ├── components/
│   │   ├── layout/        # Header, footer, page shells
│   │   ├── shared/        # Reusable components
│   │   ├── vehicles/      # Vehicle-specific components
│   │   └── ui/            # shadcn/ui primitives
│   └── lib/
│       ├── prisma.ts      # Prisma client singleton
│       └── utils.ts       # Utility functions
├── components.json        # shadcn/ui configuration
└── package.json
```

---

## 🗃️ Database Schema

The app uses a **Vehicle** model:

```prisma
model Vehicle {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  price        Int      // Stored in pence (GBP)
  shortTagline String
  category     String
  range        String   // e.g. "300 miles"
  imageUrl     String
  isFeatured   Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Managing the Database

```bash
# View/edit data visually
npx prisma studio

# Create a new migration after schema changes
npx prisma migrate dev --name describe_your_change

# Reset database (dev only!)
npx prisma migrate reset
```

---

## 🎨 Design System

### Color Palette

The design uses a clean, futuristic EV-inspired palette:

- **Primary (Electric Blue)** – Brand color for CTAs and highlights
- **Secondary (Teal Green)** – Eco/sustainability accents
- **Accent (Amber)** – Energy and performance touches
- **Background (Cool White)** – Clean, modern base
- **Foreground (Deep Charcoal)** – Clear, accessible text

### Visual Principles

- **Rounded corners** for a modern, approachable feel
- **Subtle shadows** for depth and hierarchy
- **Electric icons** (⚡, 🔋, 🚗) used sparingly for personality
- **Gradient accents** on featured elements, not overused
- **Clean typography** with good contrast and readability

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma migrate dev` | Create and apply migrations |
| `npx prisma db seed` | Seed database with sample data |

---

## 🤝 Contributing

This is a learning project, but contributions are welcome! If you'd like to add features or improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow the existing code style and component patterns
- Keep the clean, futuristic visual aesthetic
- Write TypeScript with proper types
- Test your changes locally before submitting

---


## 🙏 Acknowledgments

- Inspired by the future of sustainable transportation
- Built with modern tools to showcase cutting-edge EV technology
- Thanks to the Next.js, Tailwind, and shadcn/ui communities

---

**Made with ⚡ for everyone who believes in a cleaner, electric future.**
