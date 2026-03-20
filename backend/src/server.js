import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { seedDatabase } from './seed/seedDatabase.js';

const startServer = async () => {
  await connectDatabase();
  await seedDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`Ganesh Jewellers running on http://localhost:${env.port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${env.port} is already in use. Change PORT in backend/.env or stop the other app.`);
      process.exit(1);
    }

    console.error('Failed to start HTTP server:', error);
    process.exit(1);
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
