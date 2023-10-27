const fs = require('fs');

fs.writeFileSync('.env', `MONGO_SRV=${process.env.MONGO_SRV}\n`, { flag: 'a' });
fs.writeFileSync('.env', `DOMAIN=${process.env.DOMAIN}\n`, { flag: 'a' });
fs.writeFileSync('.env', `SESSION_SECRET=${process.env.SESSION_SECRET}\n`, { flag: 'a' });
fs.writeFileSync('.env', `CLOUDFLARE_API_TOKEN=${process.env.CLOUDFLARE_API_TOKEN}\n`, { flag: 'a' });
fs.writeFileSync('.env', `CLOUDFLARE_ZONE_ID=${process.env.CLOUDFLARE_ZONE_ID}\n`, { flag: 'a' });
