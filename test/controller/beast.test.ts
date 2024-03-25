import { Request, Response } from 'express';
import BeastController from '../../src/controller/beast';
import BeastModel from '../../src/models/beast';
import { BadRequestError, UnknownError } from '../../src/models/errors';

jest.mock('../../src/models/beast');

const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (body: Record<string, any> = {}, params: Record<string, any> = {}) => ({
    body,
    params,
}) as Request;

// Mock the BeastModel methods
jest.mock('../../src/models/beast', () => ({
    create: jest.fn(),
    getBeastById: jest.fn(),
    updateBeast: jest.fn(),
}));

describe('BeastController', () => {
    describe('create', () => {
        it('successfully creates a beast', async () => {
            const req = mockRequest({ gamerTag: 'TestTag', email: 'test@example.com' });
            const res = mockResponse();

            (BeastModel.create as jest.Mock).mockResolvedValue({ gamerTag: 'TestTag', email: 'test@example.com' });

            await BeastController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Successfully created' }));
        });

        it('handles CustomError when creation fails', async () => {
            const req = mockRequest({ gamerTag: 'TestTag', email: 'test@example.com' });
            const res = mockResponse();

            (BeastModel.create as jest.Mock).mockRejectedValue(new BadRequestError('Creation failed'));

            await BeastController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Creation failed' }));
        });
    });

    describe('getBeastById', () => {
        it('successfully retrieves a beast by id', async () => {
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            (BeastModel.getBeastById as jest.Mock).mockResolvedValue({ id: 1, gamerTag: 'TestTag', email: 'test@example.com' });

            await BeastController.getBeastById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Successfully retrieved' }));
        });

        it('returns an error for invalid ID format', async () => {
            const req = mockRequest({}, { id: 'invalid' });
            const res = mockResponse();

            await BeastController.getBeastById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid ID format' }));
        });

        it('handles CustomError when retrieval fails', async () => {
            const req = mockRequest({}, { id: '1' });
            const res = mockResponse();

            (BeastModel.getBeastById as jest.Mock).mockRejectedValue(new UnknownError('Retrieval failed'));

            await BeastController.getBeastById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Retrieval failed' }));
        });
    });

    describe('updateBeast', () => {
        it('successfully updates a beast', async () => {
            const req = mockRequest({ gamerTag: 'UpdatedTag', email: 'updated@example.com' }, { id: '1' });
            const res = mockResponse();

            (BeastModel.updateBeast as jest.Mock).mockResolvedValue({ id: 1, gamerTag: 'UpdatedTag', email: 'updated@example.com' });

            await BeastController.updateBeast(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Successfully updated' }));
        });

        it('returns an error for invalid ID format on update', async () => {
            const req = mockRequest({ gamerTag: 'UpdatedTag', email: 'updated@example.com' }, { id: 'invalid' });
            const res = mockResponse();

            await BeastController.updateBeast(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Invalid ID format' }));
        });
    });
});
