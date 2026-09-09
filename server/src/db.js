import dns from 'node:dns';
import mongoose from 'mongoose';

/**
 * A `mongodb+srv://` URI is resolved with a DNS SRV lookup, and Node does that
 * through its own resolver rather than the one Windows uses for everything
 * else. When a machine has a local DNS proxy configured (a VPN client, Docker,
 * a pi-hole) that isn't running, Node ends up asking 127.0.0.1:53, gets
 * ECONNREFUSED, and the connection fails with `querySrv ECONNREFUSED` — even
 * though the browser and every other program on the machine resolve names fine.
 *
 * DNS_SERVERS is the escape hatch: set it to a resolver that works and the
 * server stops depending on the broken local one. Left unset, Node's normal
 * resolution is untouched.
 *
 *   DNS_SERVERS=8.8.8.8,1.1.1.1
 *
 * The real fix is to correct the machine's DNS configuration; this just means a
 * broken resolver doesn't take the admissions portal down with it.
 */
function applyDnsOverride() {
  const configured = (process.env.DNS_SERVERS ?? '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (configured.length === 0) return;

  try {
    dns.setServers(configured);
    console.log(`[db] Using DNS servers from DNS_SERVERS: ${configured.join(', ')}`);
  } catch (error) {
    console.warn('[db] DNS_SERVERS is not a valid server list, ignoring it:', error.message);
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Copy server/.env.example to server/.env and add your MongoDB Atlas connection string.',
    );
  }

  applyDnsOverride();

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri);
  } catch (error) {
    // The raw message here ("querySrv ECONNREFUSED …") sends people looking at
    // Atlas, their password or their internet, none of which are the problem.
    if (error.message?.includes('querySrv') || error.code === 'ECONNREFUSED') {
      throw new Error(
        `${error.message}\n` +
          `       This is a DNS failure on this machine, not MongoDB.\n` +
          `       Node is asking ${dns.getServers().join(', ')} and getting no answer.\n` +
          `       Quick fix: add DNS_SERVERS=8.8.8.8,1.1.1.1 to server/.env and restart.`,
      );
    }
    throw error;
  }

  console.log('[db] Connected to MongoDB');
}
