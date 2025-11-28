import { test, expect } from '@playwright/test'
test.describe('Tasks', () => {

    test('cria uma tarefa', async ({ page }) => {
        await page.goto('/')
        await page.getByRole('link', { name: 'Tarefas' }).click()
        await expect(page.getByRole('heading', { name: /Tarefas/i })).toBeVisible()
        await page.getByRole('button', { name: /Adicionar Tarefa/i }).click()
        await page.getByLabel('Título:').fill("Tarefa teste")
        await page.getByLabel('Descrição:').fill("Descrição teste")
        await page.getByLabel('Status:').selectOption({ label: 'Pendente' })
        await page.getByLabel('Prioridade:').selectOption({ label: 'Média' })
        await page.getByLabel('Usuário:').selectOption({ label: 'John Doe' })
        await page.getByLabel('Categoria:').selectOption({ label: 'Work' })
        await page.getByRole('button', { name: /Criar/i }).click()
        await expect(page.getByText("Tarefa teste")).toBeVisible()
    })

        test('Edita uma tarefa', async ({ page }) => {
        await page.goto('/')
        await page.getByRole('link', { name: 'Tarefas' }).click()
        await expect(page.getByRole('heading', { name: /Tarefas/i })).toBeVisible()
        const row = page.getByRole('row', { name: /Tarefa teste/i })
        await row.getByRole('button', { name: /Editar/i }).click()
        await page.getByLabel('Título:').fill("Tarefa teste editada")
        await page.getByLabel('Descrição:').fill("Descrição teste editada")
        await page.getByLabel('Status:').selectOption({ label: 'Em Progresso' })
        await page.getByLabel('Prioridade:').selectOption({ label: 'Baixa' })
        await page.getByLabel('Usuário:').selectOption({ label: 'Jane Smith' })
        await page.getByLabel('Categoria:').selectOption({ label: 'Personal' })
        await page.getByRole('button', { name: /Atualizar/i }).click()
        await expect(page.getByText("Tarefa teste editada")).toBeVisible()
    })

});