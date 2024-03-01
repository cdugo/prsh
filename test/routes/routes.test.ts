import request from 'supertest';
import { app } from '../../src/index';
import BeastModelOriginal from '../../src/models/beast';
import { UnknownError } from '../../src/models/errors';

// Wrap the original import with jest.mocked for type-safe mocking
const BeastModel = jest.mocked(BeastModelOriginal);

jest.mock('../../src/models/beast', () => ({
    create: jest.fn(),
    getBeastById: jest.fn(),
    getBeastFriends: jest.fn(),
    updateBeast: jest.fn(),
}));

describe('Beast Routes', () => {
    const beastId = 1;
    const gamerTag = 'test';
    const email = 'test@test.com';
    const currDate = new Date();

    const mockBeast = {
        id: beastId,
        gamerTag,
        email,
        createdAt: currDate.toUTCString(),
        updatedAt: currDate.toUTCString(),
        beastieBros: [],
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('POST /beasts', () => {
        it('should create a new beast and return it', async () => {
            BeastModel.create.mockResolvedValue(mockBeast);

            const response = await request(app)
                .post('/beasts')
                .send({ gamerTag, email });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBeast);
        });

        it('should return 500 Internal Server Error when beast creation fails', async () => {
            BeastModel.create.mockRejectedValue(new UnknownError());

            const response = await request(app)
                .post('/beasts')
                .send({ gamerTag, email });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'UnknownError' });
        });
    });

    describe('GET /beasts/:id', () => {
        it('should return a beast for a given ID', async () => {
            BeastModel.getBeastById.mockResolvedValue(mockBeast);

            const response = await request(app).get(`/beasts/${beastId}`);

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockBeast);
        });

        it('should return 404 Not Found when the beast does not exist', async () => {
            BeastModel.getBeastById.mockResolvedValue(null);

            const response = await request(app).get(`/beasts/${beastId}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'NotFoundError' });
        });
    });

    describe('GET /beasts/:id/friends', () => {
        it('should return friends of the beast by its ID', async () => {
            BeastModel.getBeastFriends.mockResolvedValue(mockBeast.beastieBros);

            const response = await request(app).get(`/beasts/${beastId}/friends`);

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockBeast.beastieBros);
        });

        it('should return 404 Not Found when trying to get friends of a non-existing beast', async () => {
            BeastModel.getBeastFriends.mockResolvedValue(null);

            const response = await request(app).get(`/beasts/${beastId}/friends`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'NotFoundError' });
        });
    });

    describe('PUT /beasts/:id', () => {
        it('should update a beast and return the updated beast', async () => {
            BeastModel.updateBeast.mockResolvedValue(mockBeast);

            const response = await request(app)
                .put(`/beasts/${beastId}`)
                .send({ gamerTag, email });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBeast);
        });

        it('should return 400 Bad Request when no updates are provided', async () => {
            const response = await request(app).put(`/beasts/${beastId}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Bad Request' });
        });

        it('should return 500 Internal Server Error when the update operation fails', async () => {
            BeastModel.updateBeast.mockRejectedValue(new UnknownError());

            const response = await request(app)
                .put(`/beasts/${beastId}`)
                .send({ gamerTag, email });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'UnknownError' });
        });
    });
});