/**
 * Migrate YDoc from version 0.6.0 to 0.8.0
 */

import { PrismaClient as PrismaClientLocal } from '../prisma-generated/clientLocal';
import { prismaNewService } from './prisma';

await prismaNewService.connect();
const prismaClientLocal = new PrismaClientLocal();
prismaClientLocal.$connect();

const prismaNewClient = prismaNewService.getClient();
await prismaClientLocal.snapshot.createMany({
  data: await prismaNewClient.snapshot.findMany({
    where: {
      workspaceId: {
        equals: 'H6vffRmJbCfA-r3kq_36_',
      },
    },
  }),
});

await prismaNewService.disconnect();
