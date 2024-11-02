// Mock de Axios para evitar problemas de importación ESM
jest.mock("axios", () => ({
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      comments: {
        analyze: jest.fn(), // Simulación del método 'analyze' utilizado en el código original
      },
    })),
  }));
  
  const axios = require("axios");
  const analyzeContent = require("../../services/analyzeContent");
  const Config = require("../../models/config.model");
  const { saveLogInfo } = require("../../middlewares/logger/logInfo");
  
  jest.mock("../../models/config.model");
  jest.mock("../../middlewares/logger/logInfo");
  
  describe("analyzeContent", () => {
  
    it("debería llamar a next() cuando no hay contenido inapropiado", async () => {
      Config.findOne.mockResolvedValue({ usePerspectiveAPI: true });
      axios.create().comments.analyze.mockResolvedValue({
        data: {
          attributeScores: {
            TOXICITY: { summaryScore: { value: 0.3 } },
          },
        },
      });
  
      const req = {
        body: { content: "contenido seguro" },
      };
      const res = {};
      const next = jest.fn();
  
      await analyzeContent(req, res, next);
  
      expect(next).toHaveBeenCalled();
    });
  
    it("debería manejar el error de tiempo de espera", async () => {
      Config.findOne.mockResolvedValue({ usePerspectiveAPI: true });
      axios.create().comments.analyze.mockImplementation(() =>
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), 6000))
      );
  
      const req = {
        body: { content: "contenido de prueba" },
      };
      const res = {};
      const next = jest.fn();
  
      await analyzeContent(req, res, next);
  
      expect(next).toHaveBeenCalled();
    });
  
    it("debería omitir el análisis si usePerspectiveAPI es falso", async () => {
      Config.findOne.mockResolvedValue({ usePerspectiveAPI: false });
  
      const req = {
        body: { content: "contenido de prueba" },
      };
      const res = {};
      const next = jest.fn();
  
      await analyzeContent(req, res, next);
  
      expect(next).toHaveBeenCalled();
    });
  
    it("debería omitir el análisis si no hay API_KEY o DISCOVERY_URL", async () => {
      Config.findOne.mockResolvedValue({ usePerspectiveAPI: true });
      process.env.PERSPECTIVE_API_KEY = undefined; // Simula falta de API_KEY
      process.env.PERSPECTIVE_API_DISCOVERY_URL = undefined; // Simula falta de DISCOVERY_URL
  
      const req = {
        body: { content: "contenido de prueba" },
      };
      const res = {};
      const next = jest.fn();
  
      await analyzeContent(req, res, next);
  
      expect(next).toHaveBeenCalled();
    });
  });
  