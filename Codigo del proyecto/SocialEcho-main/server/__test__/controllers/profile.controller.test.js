const { getPublicUsers, followUser, unfollowUser, getFollowingUsers } = require('../../controllers/profile.controller');
const User = require('../../models/user.model');
const Relationship = require('../../models/relationship.model');
const Post = require('../../models/post.model');
const Community = require('../../models/community.model');

jest.mock('../../models/user.model');
jest.mock('../../models/relationship.model');
jest.mock('../../models/post.model');
jest.mock('../../models/community.model');

// Mock de Axios para evitar problemas de importación ESM
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  })),
}));

describe('Pruebas unitarias para el controlador de perfil', () => {

  describe('followUser', () => {
    it('debería seguir a un usuario correctamente', async () => {
      const req = { userId: '123', params: { id: '456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Relationship.exists = jest.fn().mockResolvedValue(false);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      Relationship.create = jest.fn().mockResolvedValue({});

      await followUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User followed successfully' });
    });

    it('debería devolver un error si ya se sigue al usuario', async () => {
      const req = { userId: '123', params: { id: '456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Relationship.exists = jest.fn().mockResolvedValue(true);

      await followUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Already following this user' });
    });
  });

  describe('unfollowUser', () => {
    it('debería dejar de seguir a un usuario correctamente', async () => {
      const req = { userId: '123', params: { id: '456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Relationship.exists = jest.fn().mockResolvedValue(true);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      Relationship.deleteOne = jest.fn().mockResolvedValue({});

      await unfollowUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User unfollowed successfully' });
    });

    it('debería devolver un error si no existe la relación', async () => {
      const req = { userId: '123', params: { id: '456' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Relationship.exists = jest.fn().mockResolvedValue(false);

      await unfollowUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Relationship does not exist' });
    });
  });
});
