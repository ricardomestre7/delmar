const WORKER_NAME = process.env.WORKER_NAME || 'cylinder-task-worker';
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '5000', 10);

console.log(`[${WORKER_NAME}] Worker initialized. Listening for tasks every ${POLL_INTERVAL_MS}ms...`);

let isRunning = true;

// Simulação de loop de trabalho assíncrono seguro
const processQueue = async () => {
  if (!isRunning) return;
  
  const timestamp = new Date().toISOString();
  console.log(`[${WORKER_NAME}][${timestamp}] Heartbeat: Queue checked. All sectors synchronized.`);

  // Agendar próximo ciclo
  setTimeout(processQueue, POLL_INTERVAL_MS);
};

processQueue();

// Graceful Shutdown
const handleShutdown = (signal) => {
  console.log(`\n[${WORKER_NAME}] Received ${signal}. Shutting down gracefully...`);
  isRunning = false;
  setTimeout(() => {
    console.log(`[${WORKER_NAME}] Exited clean.`);
    process.exit(0);
  }, 1000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
