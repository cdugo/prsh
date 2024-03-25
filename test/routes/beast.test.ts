import request from 'supertest';
import express from 'express';
import BeastController from '../../src/controller/beast';
import beastRouter from '../../src/routes/beast';

// Mock BeastController methods
jest.mock('../../src/controller/beast', () => ({
    create: jest.fn(),
    getBeastById: jest.fn(),
    updateBeast: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/beasts', beastRouter);

describe('Beast Router', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        jest.resetAllMocks();
    });

    test('POST / should call BeastController.create', async () => {
        const mockReqBody = { name: 'Griffin', age: 4 };
        (BeastController.create as jest.Mock).mockImplementation((req, res) => res.status(201).send(req.body));

        await request(app)
            .post('/beasts/')
            .send(mockReqBody)
            .expect(201)
            .expect(mockReqBody);

        expect(BeastController.create).toHaveBeenCalledTimes(1);
    });

    test('GET /:id should call BeastController.getBeastById', async () => {
        const beastId = '1';
        const mockBeast = { id: beastId, name: 'Griffin', age: 4 };
        (BeastController.getBeastById as jest.Mock).mockImplementation((req, res) => res.status(200).send(mockBeast));

        await request(app)
            .get(`/beasts/${beastId}`)
            .expect(200)
            .expect(mockBeast);

        expect(BeastController.getBeastById).toHaveBeenCalledWith(expect.anything(), expect.anything());
        expect(BeastController.getBeastById).toHaveBeenCalledTimes(1);
    });

    test('PATCH /:id should call BeastController.updateBeast', async () => {
        const beastId = '1';
        const mockUpdate = { name: 'Elder Griffin' };
        (BeastController.updateBeast as jest.Mock).mockImplementation((req, res) => res.status(200).send({ ...mockUpdate, id: beastId }));

        await request(app)
            .patch(`/beasts/${beastId}`)
            .send(mockUpdate)
            .expect(200)
            .expect({ ...mockUpdate, id: beastId });

        expect(BeastController.updateBeast).toHaveBeenCalledWith(expect.anything(), expect.anything());
        expect(BeastController.updateBeast).toHaveBeenCalledTimes(1);
    });

    // Additional tests can be added here to cover edge cases, error handling, etc.
});
