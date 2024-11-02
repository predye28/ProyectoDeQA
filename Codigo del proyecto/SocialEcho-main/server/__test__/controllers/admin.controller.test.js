const {
  retrieveServicePreference,
  updateServicePreference,
  retrieveLogInfo,
  deleteLogInfo,
  signin,
  getCommunities,
  getCommunity,
  addModerator,
  removeModerator,
  getModerators,
} = require('../../controllers/admin.controller');
const Log = require('../../models/log.model');
const Admin = require('../../models/admin.model');
const Config = require('../../models/config.model');
const Community = require('../../models/community.model');
const User = require('../../models/user.model');
const AdminToken = require('../../models/token.admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../models/log.model');
jest.mock('../../models/admin.model');
jest.mock('../../models/config.model');
jest.mock('../../models/community.model');
jest.mock('../../models/user.model');
jest.mock('../../models/token.admin.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Pruebas unitarias para el controlador de administración', () => {


  describe('deleteLogInfo', () => {
    it('debería eliminar todos los logs y devolver un mensaje de éxito', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Log.deleteMany.mockResolvedValue({});

      await deleteLogInfo(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'All logs deleted!' });
    });

    it('debería manejar errores y devolver un mensaje de error', async () => {
      Log.deleteMany.mockRejectedValue(new Error('Error al eliminar'));

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await deleteLogInfo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong!' });
    });
  });

  describe('signin', () => {
    it('debería devolver un token de acceso si las credenciales son correctas', async () => {
      const req = { body: { username: 'admin', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const mockAdmin = { _id: '1', username: 'admin', password: 'hashedPassword' };
      Admin.findOne.mockResolvedValue(mockAdmin);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');
      AdminToken.prototype.save = jest.fn().mockResolvedValue();

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ accessToken: 'token123' }));
    });

    it('debería devolver 404 si el usuario no existe', async () => {
      const req = { body: { username: 'admin', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Admin.findOne.mockResolvedValue(null);

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('debería devolver 400 si la contraseña es incorrecta', async () => {
      const req = { body: { username: 'admin', password: 'wrongpassword' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const mockAdmin = { _id: '1', username: 'admin', password: 'hashedPassword' };
      Admin.findOne.mockResolvedValue(mockAdmin);
      bcrypt.compare.mockResolvedValue(false);

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('retrieveServicePreference', () => {
    it('debería devolver la configuración de servicio existente', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const mockConfig = { usePerspectiveAPI: true };
      Config.findOne.mockResolvedValue(mockConfig);

      await retrieveServicePreference(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockConfig);
    });

  });

  describe('updateServicePreference', () => {
    it('debería actualizar y devolver la configuración', async () => {
      const req = {
        body: {
          usePerspectiveAPI: true,
          categoryFilteringServiceProvider: 'ProviderX',
          categoryFilteringRequestTimeout: 5000,
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const updatedConfig = { ...req.body };
      Config.findOneAndUpdate.mockResolvedValue(updatedConfig);

      await updateServicePreference(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedConfig);
    });

    it('debería manejar errores y devolver un mensaje de error', async () => {
      Config.findOneAndUpdate.mockRejectedValue(new Error('Error de actualización'));

      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await updateServicePreference(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating system preferences' });
    });
  });

  // Añade pruebas similares para las funciones `getCommunities`, `getCommunity`, `addModerator`, `removeModerator`, `getModerators`

});
