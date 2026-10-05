---
name: supabase-mcp
description: Use Supabase MCP server tools for database operations, queries, and data retrieval. Use when reading from Supabase database, querying tables, fetching records, or performing any database operations that would benefit from using the MCP server instead of direct client library calls.
---

# Supabase MCP

Use the Supabase MCP server tools for all database operations instead of using the Supabase client library directly.

## When to Use

Always prefer Supabase MCP server tools when:
- Reading data from Supabase database
- Querying tables or views
- Fetching records by ID or filters
- Performing database lookups
- Retrieving question data, math assets, or any other database entities

## Usage

1. **Discover available tools**: Check the Supabase MCP server tools using `call_mcp_tool` with server identifier `user-supabase` or `user-Supabase`

2. **Use MCP tools for queries**: Instead of using `supabase.from('table').select()`, use the appropriate MCP tool

3. **Check tool schemas first**: Always read the tool descriptor/schema before calling any MCP tool to understand required parameters

## Benefits

- Direct database access without client library overhead
- Better integration with MCP tool ecosystem
- Consistent tool-based approach for database operations
- More reliable for automated workflows

## Example Workflow

When user asks to fetch or read database data:
1. Identify the Supabase MCP server (check `user-supabase` or `user-Supabase`)
2. List available tools or read tool schemas
3. Use `call_mcp_tool` with appropriate server and tool name
4. Pass required parameters (table name, filters, etc.)
