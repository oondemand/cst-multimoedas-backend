const request = require("supertest");

const mockProcessarAtivas = jest.fn(async (req, res) => {
  res.status(200).json({ message: "processar-ativas" });
});

const mockProcessar = jest.fn(async (req, res) => {
  res.status(200).json({ message: "processar" });
});

const mockAtualizarCotacao = jest.fn(async (req, res) => {
  res.status(200).json({ message: "atualizar-cotacao" });
});

jest.mock("../../src/controllers/integracao", () => ({
  processarAtivas: mockProcessarAtivas,
  processar: mockProcessar,
  listar: jest.fn(),
  listaComPaginacao: jest.fn(),
  reprocessar: jest.fn(),
  arquivar: jest.fn(),
  listarConfigs: jest.fn(),
  atualizarConfig: jest.fn(),
}));

jest.mock("../../src/controllers/moeda", () => ({
  atualizarCotacao: mockAtualizarCotacao,
  listarComPaginacao: jest.fn(),
  listarAtivas: jest.fn(),
}));

const { createApp } = require("../../central-oon-core-backend/app");

describe("Core direct routes", () => {
  let app;

  beforeAll(() => {
    process.env.NODE_ENV = "test";
  });

  beforeEach(() => {
    app = createApp({
      publicDir: null,
      assetsDir: null,
      uploadsDir: null,
    });
  });

  test("/integracao/processar/ativas should trigger IntegracaoController.processarAtivas", async () => {
    const response = await request(app).post("/integracao/processar/ativas");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "processar-ativas" });
    expect(mockProcessarAtivas).toHaveBeenCalledTimes(1);
  });

  test("/integracao/processar should trigger IntegracaoController.processar", async () => {
    const response = await request(app).post("/integracao/processar");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "processar" });
    expect(mockProcessar).toHaveBeenCalledTimes(1);
  });

  test("/moedas/atualizar-cotacao should trigger MoedaController.atualizarCotacao", async () => {
    const response = await request(app).post("/moedas/atualizar-cotacao");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "atualizar-cotacao" });
    expect(mockAtualizarCotacao).toHaveBeenCalledTimes(1);
  });
});
