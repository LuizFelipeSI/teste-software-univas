import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

/**
 * Remove todos os registros do banco antes de cada teste.
 * A ordem de exclusão importa se há chaves estrangeiras.
 */
export async function resetDb() {
  await prisma.task.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
}

/**
 * Cria dados mínimos para testes que precisam de um usuário e categoria.
 */
export async function seedMinimal() {
  const user = await prisma.user.create({
    data: { name: 'Ana', email: 'ana@ex.com' },
  })

  const category = await prisma.category.create({
    data: { name: 'Work' },
  })

  return { user, category }
}

/**
 * Cria um usuário de forma prática para uso em testes.
 */
export async function createTestUser(data?: { name?: string; email?: string }) {
  const user = await prisma.user.create({
    data: {
      name: data?.name ?? 'Usuário Teste',
      email: data?.email ?? 'user@teste.com',
    },
  })
  return user
}

/**
 * Atualiza um usuário de forma prática para uso nos testes de update.
 */
export async function updateTestUser(id: number, data: { name?: string; email?: string }) {
  const user = await prisma.user.update({
    where: { id },
    data,
  })
  return user
}

/**
 * Exclui um usuário de forma prática para uso nos testes de delete.
 */
export async function deleteTestUser(id: number) {
  await prisma.user.delete({ where: { id } })
}
