import { test, expect } from '@playwright/test'
test.describe('Usuários', () => {
  
  test('navega para Usuários e lista itens do backend', async ({ page }) => {
    await page.goto('/') // Dashboard
    await page.getByRole('link', { name: 'Usuários' }).click()
    // Título da seção
    await expect(page.getByRole('heading', { name: /Usuários/i })).toBeVisible()
    // Emails semeados (seed do backend)
    await expect(page.getByText(/john.doe@example.com/i)).toBeVisible()
    await expect(page.getByText(/jane.smith@example.com/i)).toBeVisible()
  });

test('cria usuário e aparece na lista', async ({ page }) => {
    await page.goto('/users')
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()  
    const uniqueEmail = `aluno.${Date.now()}@ex.com`
    await page.getByLabel('Nome:').fill('Aluno E2E')
    await page.getByLabel('Email:').fill(uniqueEmail)  
    await page.getByRole('button', { name: /Criar/i }).click()
      // Aguarda recarga da lista
    await expect(page.getByText(uniqueEmail)).toBeVisible()
  });

    test('atualiza usuário existente', async ({ page }) => {
    await page.goto('/users')
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()

    const originalEmail = `original.${Date.now()}@ex.com`
    const originalName = 'Usuário Original'
    await page.getByLabel('Nome:').fill(originalName)
    await page.getByLabel('Email:').fill(originalEmail)
    await page.getByRole('button', { name: /Criar/i }).click()

    await expect(page.getByText(originalEmail)).toBeVisible()

    const userRow = page.locator('tr', { hasText: originalEmail })
    await userRow.getByRole('button', { name: /Editar/i }).click()

    await expect(page.getByRole('button', { name: 'Atualizar' })).toBeVisible()
    
    const updatedName = 'Nome Atualizado E2E'
    const updatedEmail = `atualizado.${Date.now()}@ex.com`

    await page.getByLabel('Nome:').fill(updatedName)
    await page.getByLabel('Email:').fill(updatedEmail)

    await page.getByRole('button', { name: /Atualizar/i }).click()

    await expect(page.getByText(updatedEmail)).toBeVisible()

    const updatedUserRow = page.locator('tr', { hasText: updatedEmail })

    await expect(updatedUserRow.getByText(updatedName)).toBeVisible()

    await expect(page.getByText(originalEmail)).not.toBeVisible()
    await expect(page.getByText(originalName)).not.toBeVisible()
});

    test('exclui usuário existente e confirma exclusão', async ({ page }) => {
    await page.goto('/users')
    await page.getByRole('button', { name: /Adicionar Usuário/i }).click()

    const userToDeleteEmail = `deletar.${Date.now()}@ex.com`
    await page.getByLabel('Nome:').fill('Usuário para Deletar')
    await page.getByLabel('Email:').fill(userToDeleteEmail)
    await page.getByRole('button', { name: /Criar/i }).click()

    await expect(page.getByText(userToDeleteEmail)).toBeVisible()

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Tem certeza que deseja excluir este usuário?')
        
        await dialog.accept()
    })
    
    const userRow = page.locator('tr', { hasText: userToDeleteEmail })
    await userRow.getByRole('button', { name: /Excluir/i }).click()

    await expect(page.getByText(userToDeleteEmail)).not.toBeVisible()
});

});
