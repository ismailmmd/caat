# Contributing to CAAT

Thank you for your interest in contributing to CAAT! This guide will help you understand the project structure and how to add new parsers. CAAT is written in TypeScript for better type safety and developer experience.

## Project Structure

```
caat/
├── src/                # TypeScript source code
│   ├── cli.ts          # Main CLI entry point
│   └── parsers/        # Parser modules directory
│       ├── base.ts     # ParserInterface definition
│       ├── index.ts    # Parser factory and registry
│       └── md.ts       # Markdown parser implementation
├── build/              # Compiled JavaScript output (generated)
│   ├── cli.js          # Compiled CLI
│   └── parsers/        # Compiled parser modules
├── tsconfig.json       # TypeScript configuration
├── package.json        # Package configuration
└── README.md           # Project documentation
```

## Architecture Overview

CAAT uses a modular parser system that allows for easy extension:

- **cli.ts**: Main entry point that handles file input and delegates to appropriate parsers
- **ParserInterface**: TypeScript interface defining the contract for all parsers
- **ParserFactory**: Registry system for managing different parser instances
- **Parser implementations**: Individual parsers for specific file formats (e.g., Markdown, JSON, etc.)

## Adding a New Parser

To add support for a new file format, follow these steps:

### 1. Create a Parser Module

Create a new file in the `src/parsers/` directory (e.g., `src/parsers/json.ts`):

```typescript
import { ParserInterface } from './parser-interface.js';

export class JsonParser implements ParserInterface {
  getExtensions(): string[] {
    return ['.json'];
  }

  parse(content: string): string {
    try {
      const jsonData: unknown = JSON.parse(content);
      return this.formatJson(jsonData);
    } catch (error) {
      throw new Error(`Error parsing JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private formatJson(data: unknown): string {
    // Your formatting logic here
    return JSON.stringify(data, null, 2);
  }
}
```

### 2. Register the Parser

Add your parser to `src/parsers/index.ts`:

```typescript
import { JsonParser } from './json.js';

// Add this line to register the parser instance
parsers.set('json', new JsonParser());
```

### 3. Parser Requirements

Every parser must:

- **Implement ParserInterface**: All parsers must implement the `ParserInterface`
- **Implement `getExtensions()`**: Method returning an array of supported file extensions
- **Implement `parse(content)`**: Method that takes file content as string and returns formatted output
- **Handle errors properly**: Use proper TypeScript error handling with type guards

#### ParserInterface Definition

The `ParserInterface` (defined in `src/parsers/parser-interface.ts`) defines the contract that all parsers must follow:

```typescript
export interface ParserInterface {
  /**
   * Returns the supported file extensions for the parser
   */
  getExtensions(): string[];
  /**
   * Parses the content and returns the formatted output
   * @param content - Content to parse
   * @returns Formatted output
   */
  parse(content: string): string;
}
```

### 4. Testing Your Parser

Build and test your parser with the CLI:

```bash
# Build the TypeScript code
npm run build

# Test with your new file format
node build/cli.js example.json

# Or use the CLI command that builds and runs
npm run cli example.json
```

## Development Guidelines

### Code Style
- Write TypeScript with proper type annotations
- Implement the `ParserInterface` for all parsers
- Use ES6+ features and modules
- Follow existing naming conventions
- Add proper error handling with type guards (`error instanceof Error`)
- Use chalk for terminal styling
- Enable strict TypeScript checking
- Register parser instances (not classes) in the factory

### Error Handling
- Throw descriptive errors for parsing failures
- Handle edge cases gracefully
- Provide helpful error messages to users
- Always use type guards for error handling: `error instanceof Error ? error.message : 'Unknown error'`

### Documentation
- Update README.md if needed
- Add inline comments for complex logic
- Update this CONTRIBUTING.md for significant architectural changes

## Examples of Parser Ideas

Here are some potential parsers you could contribute:

- **CSV Parser**: Display tabular data with borders and colors
- **JSON Parser**: Pretty-print JSON with syntax highlighting
- **YAML Parser**: Format YAML with proper indentation and colors
- **Log Parser**: Highlight log levels and timestamps
- **Code Parser**: Syntax highlighting for various programming languages
- **Config Parser**: Format configuration files (.ini, .toml, etc.)

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b add-json-parser`
3. Make your changes and test thoroughly
4. Follow the commit message format in the existing history
5. Submit a pull request with a clear description

## Getting Help

If you need help or have questions:

1. Check existing issues and discussions
2. Create a new issue with the `question` label
3. Provide code examples and expected behavior

Thank you for contributing to CAAT! 🐱
