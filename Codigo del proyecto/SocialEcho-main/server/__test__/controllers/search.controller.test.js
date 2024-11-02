const search = require('../../controllers/search.controller');
const Community = require('../../models/community.model');
const User = require('../../models/user.model');
const Post = require('../../models/post.model');

jest.mock('../../models/community.model'); // Mocks del modelo de comunidad
jest.mock('../../models/user.model'); // Mocks del modelo de usuario
jest.mock('../../models/post.model'); // Mocks del modelo de publicaciones

// Mock de Axios para evitar problemas de importación ESM
jest.mock('axios', () => ({
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
    })),
  }));  

describe('Pruebas unitarias para el controlador de búsqueda', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: { q: 'test' }, // Simulación de consulta
      userId: 'user123', // Simulación de ID de usuario
    };
    res = {
      status: jest.fn().mockReturnThis(), // Mock de la respuesta
      json: jest.fn(),
    };
  });

  it('debería devolver un estado 500 si ocurre un error', async () => {
    // Simular un error en la búsqueda de usuarios
    User.find.mockRejectedValue(new Error('Error de base de datos'));

    await search(req, res);

    expect(res.status).toHaveBeenCalledWith(500); // Verificar que se llame al estado 500
    expect(res.json).toHaveBeenCalledWith({ message: 'An error occurred' }); // Verificar el mensaje de error
  });
});
