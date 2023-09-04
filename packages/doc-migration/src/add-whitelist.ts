/**
 * Migrate YDoc from version 0.6.0 to 0.8.0
 */

import { prismaNewService } from './prisma';


await prismaNewService.connect();
const emails = [
  'ajoseph3@eagles.nccu.edu',
  'syreanis@gmail.com',
  'einsevspielt@gmail.com',
  'elioyart@gmail.com',
  'fox@tinsfox.com',
  'evan.boisdron@gmail.com',
  'mattias.burkard@gmail.com',
  'viniciotricolor@pm.me',
  'ocostaha@uci.edu',
];

const prismaNewClient = prismaNewService.getClient();
await prismaNewClient.newFeaturesWaitingList.createMany({
  data: emails.map(email => {
    return {
      email,
      type: 0,
    }
  })
});


await prismaNewService.disconnect();
