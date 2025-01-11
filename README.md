# Eisenhower Matrix App
A task management app built with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Supabase.

## Prerequisites

Before starting, ensure you have the following installed on your system:

- Visual Studio Code
- Node.js (LTS version recommended)
- Git
- PostgreSQL (for local database setup)
- Homebrew (for macOS users, optional)

## Visual Studio Code Setup
Install[Visual Studio Code](https://code.visualstudio.com/).

Add the following extensions for a smoother development experience:
- ESLint: Linting support.
- Prettier - Code Formatter: Code formatting.
- Tailwind CSS IntelliSense: Autocomplete for Tailwind CSS classes.
- Prisma: Schema autocompletion and formatting.

## GitHub Setup
Create a new GitHub repository:
Go to GitHub and click *New Repository*.
Name the repository (e.g., eisenhower-matrix) and initialize it with a `README.md` (optional).

Clone the repository locally:

```bash
git clone https://github.com/<your-username>/eisenhower-matrix.git
cd eisenhower-matrix
```

(In this case, the GitHub user is "Bunbreakable")

## Node.js and NPM Setup
Install Node.js (LTS version recommended) from https://nodejs.org/ .

Verify the installation:

```bash
node -v
npm -v
```

## Next.js Installation
Create a Next.js app in the repository:

`npx create-next-app@latest . --typescript`

- Select the `src/` folder option during setup.
- Use the default alias `(@/)`.

Start the development server:

`npm run dev`

Open http://localhost:3000 in your browser to verify the app is running.

## Prisma Setup
Install Prisma and its client:

`npm install prisma @prisma/client`

Initialize Prisma:

`npx prisma init`

This creates a `prisma/schema.prisma` file.

Edit the `prisma/schema.prisma` file:

```bash
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

generator client {
    provider = "prisma-client-js"
}

model Task {
    id        Int      @id @default(autoincrement())
    title     String
    priority  String
    completed Boolean  @default(false)
    createdAt DateTime @default(now())
}
```

Add a `.env` file with the database connection string:

`DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>"`

    Database username -- postgres
    Database password -- see local documentation
    Database name -- prioritydb

Push the schema to your database:

`npx prisma db push`

Open Prisma Studio to view the database:

`npx prisma studio`

## PostgreSQL Setup

For macOS:
Install PostgreSQL using Homebrew:

```bash
brew install postgresql
brew services start postgresql
```

Initialize the database:

`initdb /usr/local/var/postgres`

Create a new database and user:

```bash
psql -U postgres
CREATE DATABASE prioritydb;
CREATE USER postgres WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE prioritydb TO postgres;
\q
```

Update the `.env` file with:

`DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/prioritydb"`

## Supabase Setup
Sign up at Supabase and create a new project.

    Database Password -- see local Readme

Get the project URL and API key from the Settings > API section.

Add them to your `.env` file:

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### Create a Supabase client:

Add `src/lib/supabase.ts`:

```bash
import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Test the Setup
Start the development server:

`npm run dev`

Verify:
- Localhost is running.
- Tailwind styles are applied.
- Database is accessible via Prisma.

## Deployment
Push the code to GitHub:

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

Deploy using Vercel:

Connect your GitHub repo.
Add environment variables (`DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
Deploy your app.

[!TIP]
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
