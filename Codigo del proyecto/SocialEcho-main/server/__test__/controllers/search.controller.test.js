const search = require('../../controllers/search.controller');
const User = require('../../models/user.model');

jest.mock('../../models/user.model'); 

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
      query: { q: 'test' },
      userId: 'user123', 
    };
    res = {
      status: jest.fn().mockReturnThis(), // Mock de la respuesta
      json: jest.fn(),
    };
  });

  // Prueba: Devuelve un estado 500 si ocurre un error
  it('debería devolver un estado 500 si ocurre un error', async () => {
    User.find.mockRejectedValue(new Error('Error de base de datos'));

    await search(req, res);

    expect(res.status).toHaveBeenCalledWith(500); 
    expect(res.json).toHaveBeenCalledWith({ message: 'An error occurred' }); 
  });
});
