import { app } from './app.js';
import { env } from './config/env.js';

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🚀 NEXA AGENDA API INICIADA       ║
╚════════════════════════════════════════╝

📍 Server rodando em http://localhost:${PORT}
🌍 Ambiente: ${env.nodeEnv}
📱 Frontend URL: ${env.frontendUrl}

✅ Pronto para receber requisições!
  `);
});