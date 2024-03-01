import BeastModel from '../../src/models/beast';
import prisma from '../../src/db/init';
import { NotFoundError, UnknownError } from '../../src/models/errors';

jest.mock('../../src/db/init', () => ({
    beast: {
        create: jest.fn().mockResolvedValue({ /* mock beast object */ }),
        findUnique: jest.fn().mockResolvedValue({ /* mock beast object */ }),
        update: jest.fn().mockResolvedValue({ /* mock beast object */ }),
    },
}));

describe('BeastModel', () => {
    const beastId = 1;
    const gamerTag = 'test';
    const email = 'test@test.com';
    const createdAt = new Date();
    const updatedAt = new Date();

    const mockBeast = {
        id: beastId,
        gamerTag,
        email,
        createdAt,
        updatedAt,
        beastieBros: [],
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('create', () => {
        it('creates a new beast and returns it', async () => {
            jest.mocked(prisma.beast.create).mockResolvedValue(mockBeast);

            const beast = await BeastModel.create(gamerTag, email);
            expect(beast).toEqual(mockBeast);
        });

        it('throws an UnknownError when beast creation fails', async () => {
            jest.mocked(prisma.beast.create).mockRejectedValue(new Error());

            await expect(BeastModel.create(gamerTag, email)).rejects.toThrow(UnknownError);
        });
    });

    describe('getBeastById', () => {
        it('returns a beast for a given ID', async () => {
            jest.mocked(prisma.beast.findUnique).mockResolvedValue(mockBeast);

            const beast = await BeastModel.getBeastById(beastId);
            expect(beast).toEqual(mockBeast);
        });

        it('throws a NotFoundError when the beast does not exist', async () => {
            jest.mocked(prisma.beast.findUnique).mockResolvedValue(null);

            await expect(BeastModel.getBeastById(beastId)).rejects.toThrow(NotFoundError);
        });
    });

    // describe('getBeastFriends', () => {
    //     it('returns friends of the beast by its ID', async () => {
    //         jest.mocked(prisma.beast.findUnique).mockResolvedValue(mockBeast);

    //         const friends = await BeastModel.getBeastFriends(beastId);
    //         expect(friends).toEqual(mockBeast.beastieBros);
    //     });

    //     it('throws a NotFoundError when trying to get friends of a non-existing beast', async () => {
    //         jest.mocked(prisma.beast.findUnique).mockResolvedValue(null);

    //         await expect(BeastModel.getBeastFriends(beastId)).rejects.toThrow(NotFoundError);
    //     });
    // });

    describe('updateBeast', () => {
        it('updates a beast and returns the updated beast', async () => {
            jest.mocked(prisma.beast.update).mockResolvedValue(mockBeast);

            const beast = await BeastModel.updateBeast(beastId, gamerTag, email);
            expect(beast).toEqual(mockBeast);
        });

        it('throws an error when no updates are provided', async () => {
            await expect(BeastModel.updateBeast(beastId)).rejects.toThrow(Error);
        });

        it('throws an UnknownError when the update operation fails', async () => {
            jest.mocked(prisma.beast.update).mockRejectedValue(new Error());

            await expect(BeastModel.updateBeast(beastId, gamerTag, email)).rejects.toThrow(UnknownError);
        });
    });
});
