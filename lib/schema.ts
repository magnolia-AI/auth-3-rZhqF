import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Using text for Neon Auth user ID
  title: text('title').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

