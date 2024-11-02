const { addContextData, getAuthContextData } = require('../../controllers/auth.controller');
const UserContext = require('../../models/context.model');

jest.mock('../../models/context.model');
jest.mock('axios', () => ({
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
    })),
  }));
  
describe('Pruebas unitarias para el controlador de autenticación', () => {

  describe('addContextData', () => {
    it('debería agregar datos del contexto correctamente', async () => {
      const req = {
        userId: '609e128b9f1b2e001c8e0e3c',
        email: 'test@example.com',
        ip: '127.0.0.1',
        useragent: {
          browser: 'Chrome',
          version: '92',
          platform: 'Win32',
          os: 'Windows',
          device: 'Desktop',
          isMobile: false,
          isDesktop: true,
          isTablet: false,
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      UserContext.prototype.save = jest.fn().mockResolvedValue({});

      await addContextData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email verification process was successful' });
    });

  });

  describe('getAuthContextData', () => {
    it('debería devolver los datos del contexto del usuario', async () => {
      const req = {
        userId: '609e128b9f1b2e001c8e0e3c',
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      UserContext.findOne = jest.fn().mockResolvedValue({
        ip: '127.0.0.1',
        country: 'US',
        city: 'New York',
        browser: 'Chrome',
        platform: 'Win32',
        os: 'Windows',
        device: 'Desktop',
        deviceType: 'Desktop',
      });

      await getAuthContextData(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        ip: '127.0.0.1',
        country: 'US',
        city: 'New York',
        browser: 'Chrome',
        platform: 'Win32',
        os: 'Windows',
        device: 'Desktop',
        deviceType: 'Desktop',
      }));
    });

    it('debería devolver un error 404 si no se encuentran datos del usuario', async () => {
      const req = {
        userId: '609e128b9f1b2e001c8e0e3c',
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      UserContext.findOne = jest.fn().mockResolvedValue(null);

      await getAuthContextData(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
    });

    it('debería devolver un error si ocurre un problema al buscar', async () => {
      const req = {
        userId: '609e128b9f1b2e001c8e0e3c',
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      UserContext.findOne = jest.fn().mockRejectedValue(new Error('Find failed'));

      await getAuthContextData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
