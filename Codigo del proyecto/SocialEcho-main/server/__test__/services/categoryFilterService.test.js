const createCategoryFilterService = require('../../services/categoryFilterService');
const { 
  getCategoriesFromTextRazor, 
  getCategoriesFromInterfaceAPI, 
  getCategoriesFromClassifierAPI 
} = require('../../services/apiServices');

// Mock de las funciones de API para evitar llamadas reales
jest.mock('../../services/apiServices', () => ({
  getCategoriesFromTextRazor: jest.fn(),
  getCategoriesFromInterfaceAPI: jest.fn(),
  getCategoriesFromClassifierAPI: jest.fn(),
}));

describe('CategoryFilterService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. Prueba: Verifica que se utilice TextRazorService para obtener categorías
  it('Debe usar TextRazorService para obtener categorías', async () => {
    const mockContent = 'test content';
    const mockTimeout = 1000;
    const expectedCategories = ['category1', 'category2'];

    getCategoriesFromTextRazor.mockResolvedValue(expectedCategories);

    const service = createCategoryFilterService('TextRazor');
    const categories = await service.getCategories(mockContent, mockTimeout);

    expect(categories).toEqual(expectedCategories);
    expect(getCategoriesFromTextRazor).toHaveBeenCalledWith(mockContent, mockTimeout);
  });

  // 2. Prueba: Verifica que se utilice InterfaceAPIService para obtener categorías
  it('Debe usar InterfaceAPIService para obtener categorías', async () => {
    const mockContent = 'test content';
    const mockTimeout = 1000;
    const expectedCategories = ['categoryA', 'categoryB'];

    getCategoriesFromInterfaceAPI.mockResolvedValue(expectedCategories);

    const service = createCategoryFilterService('InterfaceAPI');
    const categories = await service.getCategories(mockContent, mockTimeout);

    expect(categories).toEqual(expectedCategories);
    expect(getCategoriesFromInterfaceAPI).toHaveBeenCalledWith(mockContent, mockTimeout);
  });

  // 3. Prueba: Verifica que se utilice ClassifierAPIService para obtener categorías
  it('Debe usar ClassifierAPIService para obtener categorías', async () => {
    const mockContent = 'test content';
    const mockTimeout = 1000;
    const expectedCategories = ['categoryX', 'categoryY'];

    getCategoriesFromClassifierAPI.mockResolvedValue(expectedCategories);

    const service = createCategoryFilterService('ClassifierAPI');
    const categories = await service.getCategories(mockContent, mockTimeout);

    expect(categories).toEqual(expectedCategories);
    expect(getCategoriesFromClassifierAPI).toHaveBeenCalledWith(mockContent, mockTimeout);
  });

  // 4. Prueba: Verifica que se lance un error para una preferencia de servicio no válida
  it('Debe lanzar error para preferencia de servicio no válida', () => {
    expect(() => {
      createCategoryFilterService('InvalidService');
    }).toThrow('Invalid service preference');
  });
});
