const fs = require('fs');
const TextRazorClassifierManager = require('../path/to/manageClassifier'); // Ajusta la ruta según tu archivo

// Mock de Axios para evitar problemas de importación ESM
jest.mock('axios', () => ({
  put: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
}));

// Mock de fs para evitar llamadas al sistema de archivos
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('TextRazorClassifierManager', () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock del contenido del archivo CSV
    fs.readFileSync.mockReturnValue('mocked,csv,data');

    // Configuración del objeto con variables de entorno de prueba
    process.env.TEXTRAZOR_API_KEY = 'test_api_key';
    process.env.TEXTRAZOR_API_URL = 'http://test.api.url';

    // Instancia del manager para cada prueba
    manager = new TextRazorClassifierManager();
  });

  // Prueba 1: Verificar la inicialización del constructor
  it('1. Debe inicializar correctamente el objeto con los datos de API y archivo CSV', () => {
    expect(manager.apiKey).toBe('test_api_key');
    expect(manager.classifierData).toBe('mocked,csv,data');
    expect(manager.classifierId).toBe('community');
    expect(manager.url).toBe('http://test.api.url');
  });

  // Prueba 2: Comprobar que la función create llama a axios.put con la URL y headers correctos
  it('2. Debe llamar a axios.put con los headers y la URL correcta en create()', async () => {
    axios.put.mockResolvedValue({ data: 'mocked response' });

    await manager.create();

    expect(axios.put).toHaveBeenCalledWith(
      'http://test.api.url/categories/community',
      'mocked,csv,data',
      {
        headers: {
          'X-TextRazor-Key': 'test_api_key',
          'Content-Type': 'application/csv',
        },
      }
    );
  });

  // Prueba 3: Verificar que la función get llama a axios.get con los headers y URL correctos
  it('3. Debe llamar a axios.get con los headers y la URL correcta en get()', async () => {
    axios.get.mockResolvedValue({ data: 'mocked response' });

    await manager.get();

    expect(axios.get).toHaveBeenCalledWith(
      'http://test.api.url/categories/community/_all?limit=20&offset=0',
      {
        headers: {
          'X-TextRazor-Key': 'test_api_key',
        },
      }
    );
  });

  // Prueba 4: Comprobar que delete llama a axios.delete con los headers y URL correctos
  it('4. Debe llamar a axios.delete con los headers y la URL correcta en delete()', async () => {
    axios.delete.mockResolvedValue({ data: 'mocked response' });

    await manager.delete();

    expect(axios.delete).toHaveBeenCalledWith(
      'http://test.api.url/categories/community',
      {
        headers: {
          'X-TextRazor-Key': 'test_api_key',
        },
      }
    );
  });

  // Prueba 5: Verificar que handleResponse imprime correctamente la respuesta
  it('5. Debe imprimir correctamente la respuesta en consola en handleResponse()', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const mockResponse = { data: { message: 'Success' } };

    manager.handleResponse(mockResponse);

    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(mockResponse.data, null, 2));
    consoleSpy.mockRestore();
  });

  // Prueba 6: Verificar que handleError imprime correctamente el error
  it('6. Debe imprimir correctamente el error en consola en handleError()', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockError = new Error('Test error');

    manager.handleError(mockError);

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
    consoleSpy.mockRestore();
  });
});
