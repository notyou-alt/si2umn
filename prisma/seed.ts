import { seedMain } from './seed-main';
import { seedCMS } from './seed-cms';

async function main() {
  await seedMain();
  await seedCMS();
}

main();