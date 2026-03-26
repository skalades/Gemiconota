
import prisma from '../src/lib/prisma';
import fs from 'fs';

async function main() {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' }
    });
    const output = settings.map(s => `${s.key}: ${s.value}`).join('\n');
    fs.writeFileSync('c:\\Users\\skala\\OneDrive\\Documents\\project\\gemiconota\\settings-audit.txt', output);
    console.log('Audit written to settings-audit.txt');
  } catch (error) {
    console.error('Error fetching settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
