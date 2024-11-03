const processPost = require('../../services/processPost');
const createCategoryFilterService = require('../../services/categoryFilterService');
const Config = require('../../models/config.model');

// Mock de Axios para evitar problemas de importación ESM
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

// Mocks de dependencias para evitar llamadas reales
jest.mock('../../services/categoryFilterService');
jest.mock('../../models/config.model');

describe('processPost middleware', () => {
  const req = {
    body: { content: 'sample content', communityName: 'community1' },
    failedDetection: false,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Prueba: Debe continuar con next() si el serviceProvider está deshabilitado
  it('Debe continuar con next() si el serviceProvider está deshabilitado', async () => {
    Config.findOne.mockResolvedValue({ categoryFilteringServiceProvider: 'disabled', categoryFilteringRequestTimeout: 10000 });

    await processPost(req, res, next);

    //el failedDetection como sigue en false, ya luego se llama a next()
    expect(req.failedDetection).toBe(false);
    expect(next).toHaveBeenCalled();
  });

  // 2. Prueba: Debe continuar con next() si la comunidad recomendada coincide
  it('Debe continuar con next() si la comunidad recomendada coincide', async () => {
    Config.findOne.mockResolvedValue({ categoryFilteringServiceProvider: 'enabled', categoryFilteringRequestTimeout: 10000 });
    const mockService = { getCategories: jest.fn().mockResolvedValue({ community1: true }) };
    createCategoryFilterService.mockReturnValue(mockService);

    await processPost(req, res, next);

    expect(req.failedDetection).toBe(false);
    expect(next).toHaveBeenCalled();
  });

  // 3. Prueba: Debe responder con 403 si la comunidad recomendada no coincide
  it('Debe responder con 403 si la comunidad recomendada no coincide', async () => {
    Config.findOne.mockResolvedValue({ categoryFilteringServiceProvider: 'enabled', categoryFilteringRequestTimeout: 10000 });
    const mockService = { getCategories: jest.fn().mockResolvedValue({ differentCommunity: true }) };
    createCategoryFilterService.mockReturnValue(mockService);

    await processPost(req, res, next);

    // Responde con 403 y luego ya envia el mensaje
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      type: 'categoryMismatch',
      info: { community: 'community1', recommendedCommunity: 'differentCommunity' },
    });
  });

  // 4. Prueba: Debe continuar con next() si no se encuentran categorías
  it('Debe continuar con next() si no se encuentran categorías', async () => {
    Config.findOne.mockResolvedValue({ categoryFilteringServiceProvider: 'enabled', categoryFilteringRequestTimeout: 10000 });
    const mockService = { getCategories: jest.fn().mockResolvedValue({}) };
    createCategoryFilterService.mockReturnValue(mockService);

    await processPost(req, res, next);

    // failedDetection que sea true y se llama a next()
    expect(req.failedDetection).toBe(true);
    expect(next).toHaveBeenCalled();
  });
});
