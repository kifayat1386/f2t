import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  studio: {
    port: 5555,
  },
  migrate: {
    schemaPath: 'infra/prisma/schema.prisma',
    databaseUrl: process.env.DATABASE_URL,
  },
})
