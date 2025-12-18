# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package for integrating with Odoo ERP systems. It provides a custom n8n node that enables workflow automation by connecting to Odoo instances through their JSON-RPC API.

## Development Commands

```bash
# Build the project (compiles TypeScript and copies icons)
npm run build

# Development mode with file watching
npm run dev

# Lint the code
npm run lint

# Auto-fix linting issues
npm run lintfix

# Format code with Prettier
npm run format

# Pre-publish checks (build + lint with stricter rules)
npm run prepublishOnly
```

## Architecture

### Core Components

- **[Odoo.node.ts](nodes/Odoo/Odoo.node.ts)**: Main node implementation following n8n's INodeType interface
- **[GenericFunctions.ts](nodes/Odoo/GenericFunctions.ts)**: Contains all Odoo API interaction functions including JSONRPC calls
- **[ResourceDescription.ts](nodes/Odoo/ResourceDescription.ts)**: Defines the node's UI properties and parameter structure

### Key Architecture Patterns

1. **JSONRPC Integration**: All Odoo communication uses `odooJSONRPCRequest()` function with standardized service/method mapping
2. **Resource Mapping**: Odoo model names are mapped through `mapOdooResources` (e.g., 'contact' → 'res.partner')
3. **Operation Mapping**: CRUD operations map to Odoo methods via `mapOperationToJSONRPC`
4. **Dynamic Loading**: Node properties are loaded dynamically from Odoo (models, operations, fields)

### Build Process

The build system:
1. Compiles TypeScript to `dist/` directory
2. Copies SVG icons to maintain node branding
3. Outputs to `dist/nodes/Odoo/Odoo.node.js` (registered in package.json)

### ESLint Configuration

Uses n8n-specific ESLint rules with custom overrides for nodes and credentials. Key rules are disabled for community packages where n8n's strict guidelines don't apply.

## Comprehensive Odoo API Support

The node now provides complete coverage of Odoo's JSON-RPC API with the following operations:

### Standard CRUD Operations
- **Create**: Create new records with field validation
- **Read**: Get specific records by ID with field selection
- **Update**: Update existing records with field validation
- **Delete**: Remove records by ID

### Advanced Search & Retrieval
- **Search**: Return record IDs matching search criteria
- **Get Many**: Combined search and read with filtering and pagination
- **Search Count**: Count records matching criteria without returning data
- **Name Search**: Search records by display name/text

### Record Operations
- **Copy**: Duplicate records with optional default value overrides
- **Exists**: Check if specific record IDs exist
- **Name Get**: Retrieve display names for record IDs
- **Read Group**: Grouped aggregation with grouping, ordering, and lazy loading

### Access Control
- **Check Access Rights**: Verify user permissions for operations (read/write/create/delete)

### API Architecture
- Database name resolution via `odooGetDBName()`
- User authentication through `odooGetUserID()`
- Model field discovery with `odooGetModelFields()`
- Comprehensive filter operations with 10 supported operators
- Pagination support with offset/limit parameters
- All API calls route through centralized `odooJSONRPCRequest()` function

Each operation follows Odoo's standard JSON-RPC protocol and includes proper error handling and parameter validation.