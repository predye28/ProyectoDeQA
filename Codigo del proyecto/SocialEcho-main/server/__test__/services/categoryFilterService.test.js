const createCategoryFilterService = require('../../services/categoryFilterService');

const { 
  getCategoriesFromTextRazor, 
  getCategoriesFromInterfaceAPI, 
  getCategoriesFromClassifierAPI 
} = require('../../services/apiServices');

// Usamos jest.mock para simular las funciones de las APIs
jest.mock('../../services/apiServices', () => ({
  getCategoriesFromTextRazor: jest.fn(),
  getCategoriesFromInterfaceAPI: jest.fn(),
  getCategoriesFromClassifierAPI: jest.fn(),
}));

describe('CategoryFilterService', () => {
  afterEach(() => {
    // Limpiar los mocks después de cada prueba
    jest.clearAllMocks(); 
  });

  it('should use TextRazorService to get categories', async () => {
    // Esta prueba verifica que el servicio TextRazor se utiliza correctamente para obtener categorías.
    const mockContent = 'test content'; // Contenido de prueba que se usará para la consulta
    const mockTimeout = 1000; // Tiempo de espera simulado
    const expectedCategories = ['category1', 'category2']; // Categorías esperadas que debe devolver la API

    // Simula la respuesta de la API
    getCategoriesFromTextRazor.mockResolvedValue(expectedCategories);

    // Creamos una instancia del servicio
    const service = createCategoryFilterService('TextRazor');
    // Llamamos al método getCategories con los datos de prueba
    const categories = await service.getCategories(mockContent, mockTimeout);

    // Verificamos que se obtuvieron las categorías esperadas
    expect(categories).toEqual(expectedCategories);
    // Verificamos que la función de la API fue llamada con los parámetros correctos
    expect(getCategoriesFromTextRazor).toHaveBeenCalledWith(mockContent, mockTimeout);
  });

  it('should use InterfaceAPIService to get categories', async () => {
    // Esta prueba verifica que el servicio InterfaceAPI se utiliza correctamente para obtener categorías.
    const mockContent = 'test content'; // Contenido de prueba
    const mockTimeout = 1000; // Tiempo de espera simulado
    const expectedCategories = ['categoryA', 'categoryB']; // Categorías esperadas de la API

    // Simula la respuesta de la API
    getCategoriesFromInterfaceAPI.mockResolvedValue(expectedCategories);

    // Creamos una instancia del servicio
    const service = createCategoryFilterService('InterfaceAPI');
    // Llamamos al método getCategories
    const categories = await service.getCategories(mockContent, mockTimeout);

    // Verificamos que se obtuvieron las categorías esperadas
    expect(categories).toEqual(expectedCategories);
    // Verificamos que la función de la API fue llamada con los parámetros correctos
    expect(getCategoriesFromInterfaceAPI).toHaveBeenCalledWith(mockContent, mockTimeout);
  });

  it('should use ClassifierAPIService to get categories', async () => {
    // Esta prueba verifica que el servicio ClassifierAPI se utiliza correctamente para obtener categorías.
    const mockContent = 'test content'; // Contenido de prueba
    const mockTimeout = 1000; // Tiempo de espera simulado
    const expectedCategories = ['categoryX', 'categoryY']; // Categorías esperadas de la API

    // Simula la respuesta de la API
    getCategoriesFromClassifierAPI.mockResolvedValue(expectedCategories);

    // Creamos una instancia del servicio
    const service = createCategoryFilterService('ClassifierAPI');
    // Llamamos al método getCategories
    const categories = await service.getCategories(mockContent, mockTimeout);

    // Verificamos que se obtuvieron las categorías esperadas
    expect(categories).toEqual(expectedCategories);
    // Verificamos que la función de la API fue llamada con los parámetros correctos
    expect(getCategoriesFromClassifierAPI).toHaveBeenCalledWith(mockContent, mockTimeout);
  });

  it('should throw error for invalid service preference', () => {
    // Esta prueba verifica que se lance un error cuando se proporciona una preferencia de servicio no válida.
    expect(() => {
      createCategoryFilterService('InvalidService');
    }).toThrow('Invalid service preference'); // Se espera que se lance el mensaje de error correspondiente
  });
});
