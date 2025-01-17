import axios from 'axios';
import { countUsers, getAllUsers, createUser } from '../services/api';

jest.mock('axios');

// Pour eviter les messages d'erreurs attendu dans les logs de la console
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe('API Tests', () => {
  describe('countUsers', () => {
    it('fetches successfully data from an API', async () => {
      const data = {
        data: {
          users: [
            {
              id: '1',
              nom: 'a',
              prenom: 'b',
              email: 'c@c.fr',
            },
          ],
        },
      };

      axios.get.mockImplementationOnce(() => Promise.resolve(data));
      await expect(countUsers()).resolves.toEqual(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.SERVER_URL}/users`,
        );
    });

    it('handles API errors gracefully', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error('API Error'))
      );

      await expect(countUsers()).rejects.toThrow('API Error');
    });
  });

  describe('getAllUsers', () => {
    it('fetches a list of users successfully', async () => {
      const data = {
        data: {
          utilisateurs: [
            {
              id: '1',
              nom: 'c',
              prenom: 'd',
              email: 'e@e.fr',
            },
            {
              id: '2',
              nom: 'f',
              prenom: 'g',
              email: 'h@h.f',
            },
          ],
        },
      };

      axios.get.mockImplementationOnce(() => Promise.resolve(data));
      const result = await getAllUsers();
      expect(result).toEqual(data.data);
      expect(axios.get).toHaveBeenCalledWith(`${process.env.SERVER_URL}/users`);
    });

    it('handles API errors gracefully', async () => {
      axios.get.mockImplementationOnce(() =>
        Promise.reject(new Error('API Error'))
      );

      await expect(getAllUsers()).rejects.toThrow('API Error');
    });
  });

  describe('createUser', () => {
    it('creates a new user successfully', async () => {
      const newUser = {
        nom: 'i',
        prenom: 'j',
        email: 'k@k.fr',
      };

      const data = {
        data: {
          utilisateur: {
            id: '3',
            ...newUser,
          },
        },
      };

      axios.post.mockImplementationOnce(() => Promise.resolve(data));
      const result = await createUser(newUser);
      expect(result).toEqual(data.data);
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.SERVER_URL}/users`,
        newUser
      );
    });

    it('handles API errors gracefully', async () => {
      const newUser = {
        nom: 'l',
        prenom: 'm',
        email: 'n@n.fr',
      };

      axios.post.mockImplementationOnce(() =>
        Promise.reject(new Error('API Error'))
      );

      await expect(createUser(newUser)).rejects.toThrow('API Error');
    });
  });
});
