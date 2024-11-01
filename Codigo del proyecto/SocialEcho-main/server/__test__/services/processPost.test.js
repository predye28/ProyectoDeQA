const processPost = require('../../services/processPost');
const { saveLogInfo } = require('../../middlewares/logger/logInfo');
const createCategoryFilterService = require('../../services/categoryFilterService');
const Config = require('../../models/config.model');

// Mock de Axios para evitar problemas de importación ESM
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

// Simula (mock) las dependencias para no llamar a funciones reales
jest.mock('../../middlewares/logger/logInfo', () => ({
  saveLogInfo: jest.fn(), // Asegúrate de que el mock esté definido
}));
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

  // Limpiamos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Prueba cuando el serviceProvider está deshabilitado
  it('Debe continuar con next() si el serviceProvider está deshabilitado', async () => {
    // Configuración de mock para deshabilitar el proveedor de servicios
    Config.findOne.mockResolvedValue({ categoryFilteringServiceProvider: 'disabled', categoryFilteringRequestTimeout: 10000 });

    await processPost(req, res, next);

    // Verifica que el middleware pase a la siguiente función y que failedDetection sea false
    expect(req.failedDetection).toBe(false);
    expect(next).toHaveBeenCalled();
  });

  // 2. Prueba cuando el serviceProvider está habilitado y la comunidad recomendada coincide
  it('Debe continuar con next() si la comunidad recomendada coincide', async () => {
    // Configuración para habilitar el proveedor y devolver una comunidad coincidente
    Config.findOne.mockResolvedValue({ categoryFilteringServiceProvider: 'enabled', categoryFilteringRequestTimeout: 10000 });
    const mockService = { getCategories: jest.fn().mockResolvedValue({ community1: true }) };
    createCategoryFilterService.mockReturnValue(mockService);

    await processPost(req, res, next);

    // Verifica que el middleware pase a la siguiente función y que failedDetection sea false
    expect(req.failedDetection).toBe(false);
    expect(next).toHaveBeenCalled();
  });

  // 3. Prueba cuando el serviceProvider está habilitado, pero la comunidad recomendada no coincide
  it('Debe responder con 403 si la comunidad recomendada no coincide', async () => {
    // Configuración para habilitar el proveedor y devolver una comunidad diferente
    Config.findOne.mockResolvedValue({ categoryFilteringServiceProvider: 'enabled', categoryFilteringRequestTimeout: 10000 });
    const mockService = { getCategories: jest.fn().mockResolvedValue({ differentCommunity: true }) };
    createCategoryFilterService.mockReturnValue(mockService);

    await processPost(req, res, next);

    // Verifica que responda con 403 y devuelva un mensaje con categoryMismatch
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      type: 'categoryMismatch',
      info: { community: 'community1', recommendedCommunity: 'differentCommunity' },
    });
  });

  // 4. Prueba cuando el serviceProvider está habilitado, pero no se encuentran categorías
  it('Debe continuar con next() si no se encuentran categorías', async () => {
    // Configuración para habilitar el proveedor pero sin resultados de categoría
    Config.findOne.mockResolvedValue({ categoryFilteringServiceProvider: 'enabled', categoryFilteringRequestTimeout: 10000 });
    const mockService = { getCategories: jest.fn().mockResolvedValue({}) };
    createCategoryFilterService.mockReturnValue(mockService);

    await processPost(req, res, next);

    // Verifica que failedDetection sea true y pase a la siguiente función
    expect(req.failedDetection).toBe(true);
    expect(next).toHaveBeenCalled();
  });
});
