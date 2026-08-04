# @pipeworx/wynncraft

[Wynncraft](https://docs.wynncraft.com/) MCP — keyless lookups for the Minecraft MMO Wynncraft.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `player(uuid_or_username)` — player stats
- `player_characters(uuid_or_username)` — character list
- `guild(name_or_prefix)` — guild detail
- `guild_list()` — list all guilds
- `online_players()` — currently online by server
- `leaderboard(type, resultLimit?)` — leaderboard (`combatGlobalLevel` | `professionsGlobalLevel` | `guildLevel` | `globalPlayerContent` | …)
- `item_database()` — full item DB
- `item_search(query)` — item search by name
- `news()` — official news feed

## Data source

`https://api.wynncraft.com/v3`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "wynncraft": {
      "url": "https://gateway.pipeworx.io/wynncraft/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Wynncraft data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
