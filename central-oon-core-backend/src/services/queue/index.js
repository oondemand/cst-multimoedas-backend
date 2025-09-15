const defaultHandler = require('./defaultHandler');

const createQueue = ({ handler, limit = 1, next, onError }) => {
  let activeTasks = 0;
  let queueRunning = false;

  if (!next) throw new Error('Função next não implementada!');

  const runNext = async () => {
    if (!queueRunning || activeTasks >= limit) return;

    const item = await next();

    if (!item) {
      queueRunning = false;
      return;
    }

    activeTasks++;

    try {
      await handler(item);
    } catch (error) {
      onError?.(error);
      console.error('🔴 [QUEUE ERROR]', error);
    } finally {
      activeTasks--;
      runNext();
    }

    runNext();
  };

  const start = () => {
    if (queueRunning) return;
    queueRunning = true;
    runNext();
  };

  return { start };
};

module.exports = {
  createQueue,
  defaultHandler,
};
