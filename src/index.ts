interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Wynncraft MCP.
 */


const BASE = 'https://api.wynncraft.com/v3';
const UA = 'pipeworx-mcp-wynncraft/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'player', description: 'Player stats.', inputSchema: { type: 'object', properties: { uuid_or_username: { type: 'string' } }, required: ['uuid_or_username'] } },
  { name: 'player_characters', description: 'Character list.', inputSchema: { type: 'object', properties: { uuid_or_username: { type: 'string' } }, required: ['uuid_or_username'] } },
  { name: 'guild', description: 'Guild detail.', inputSchema: { type: 'object', properties: { name_or_prefix: { type: 'string' }, by: { type: 'string', description: '"name" (default) | "prefix"' } }, required: ['name_or_prefix'] } },
  { name: 'guild_list', description: 'List all guilds.', inputSchema: { type: 'object', properties: {} } },
  { name: 'online_players', description: 'Currently online players by server.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'leaderboard',
    description: 'Leaderboard.',
    inputSchema: { type: 'object', properties: { type: { type: 'string' }, resultLimit: { type: 'number' } }, required: ['type'] },
  },
  { name: 'item_database', description: 'Full item database.', inputSchema: { type: 'object', properties: {} } },
  { name: 'item_search', description: 'Item search by name.', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
  { name: 'news', description: 'Official news feed.', inputSchema: { type: 'object', properties: {} } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string, params?: URLSearchParams) => {
    const url = `${BASE}${path}${params ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (res.status === 404) throw new Error('Wynncraft: 404 — not found.');
    if (!res.ok) throw new Error(`Wynncraft: ${res.status}`);
    return res.json();
  };
  switch (name) {
    case 'player':
      return get(`/player/${encodeURIComponent(reqStr(args, 'uuid_or_username', '"<name>"'))}`);
    case 'player_characters':
      return get(`/player/${encodeURIComponent(reqStr(args, 'uuid_or_username', '"<name>"'))}/characters`);
    case 'guild': {
      const id = reqStr(args, 'name_or_prefix', '"AVO"');
      const by = String(args.by ?? 'name');
      const p = new URLSearchParams({ identifier: by });
      return get(`/guild/${by === 'prefix' ? 'prefix/' : ''}${encodeURIComponent(id)}`, p);
    }
    case 'guild_list':
      return get('/guild/list/guild');
    case 'online_players':
      return get('/player');
    case 'leaderboard': {
      const p = new URLSearchParams();
      if (args.resultLimit != null) p.set('resultLimit', String(args.resultLimit));
      return get(`/leaderboards/${encodeURIComponent(reqStr(args, 'type', '"combatGlobalLevel"'))}`, p);
    }
    case 'item_database':
      return get('/item/database');
    case 'item_search':
      return get(`/item/search/${encodeURIComponent(reqStr(args, 'query', '"Idol"'))}`);
    case 'news':
      return get('/latest-news');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
