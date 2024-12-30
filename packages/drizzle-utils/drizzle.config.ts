import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './src/test/testSchema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://dev_admin:dev_admin_password@localhost:5441/drizzle_utils?schema=public',
  },
})
