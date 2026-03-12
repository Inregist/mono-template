# @repo/database

Shared database package using Drizzle ORM with PostgreSQL.

## Usage

```ts
import { db, users } from '@repo/database';

const allUsers = await db.select().from(users);
```

## Commands

- `pnpm db:generate` - Generate migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Drizzle Studio
