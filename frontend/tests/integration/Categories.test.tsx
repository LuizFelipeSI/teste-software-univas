import { render, screen, waitFor } from "@testing-library/react";
import { server, apiGet } from "../setup";
import { HttpResponse } from "msw";
import Categories from "../../src/components/Categories";

describe("Categories – Integração com API", () => {

    // ---------------------------
    // SUCESSO DA API
    // ---------------------------
    it("renderiza categorias quando a API responde com sucesso", async () => {
        server.use(
            apiGet("/categories", () =>
                HttpResponse.json({
                    success: true,
                    count: 2,
                    data: [
                        {
                            id: "1",
                            name: "Trabalho",
                            description: "Coisas do trabalho",
                            createdAt: new Date().toISOString(),
                            tasks: [{ id: "t1", title: "Relatório", user: { id: "u1", name: "João" } }]
                        },
                        {
                            id: "2",
                            name: "Pessoal",
                            description: "Rotina e vida pessoal",
                            createdAt: new Date().toISOString(),
                            tasks: []
                        }
                    ]
                })
            )
        );

        render(<Categories />);

        // Loading
        expect(screen.getByText("Carregando categorias...")).toBeInTheDocument();

        // Dados carregados
        expect(await screen.findByText("Trabalho")).toBeInTheDocument();
        expect(await screen.findByText("Pessoal")).toBeInTheDocument();

        // Tarefas (1 e 0)
        expect(await screen.findByText("1")).toBeInTheDocument();
        expect(await screen.findByText("0")).toBeInTheDocument();
    });

    // ---------------------------
    // ERRO DA API
    // ---------------------------
    it("mostra mensagem de erro quando a API falha", async () => {
        server.use(
            apiGet("/categories", () =>
                HttpResponse.json(
                    { success: false, error: "Failed to fetch categories" },
                    { status: 500 }
                )
            )
        );

        render(<Categories />);

        await waitFor(() => {
            expect(
                screen.getByText("Erro ao carregar categorias")
            ).toBeInTheDocument();
        });
    });
});
