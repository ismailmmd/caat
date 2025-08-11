# Contributing to CAAT

Thank you for your interest in contributing to CAAT! This guide will help you understand the project structure and how to add new parsers.

## Project Structure

```
caat/
├── cli.js              # Main CLI entry point
├── parsers/            # Parser modules directory
│   ├── index.js        # Parser factory and registry
│   └── md.js          # Markdown parser implementation
├── package.json        # Package configuration
└── README.md          # Project documentation
```

## Architecture Overview

CAAT uses a modular parser system that allows for easy extension:

- **cli.js**: Main entry point that handles file input and delegates to appropriate parsers
- **ParserFactory**: Registry system for managing different file format parsers
- **Parser modules**: Individual parsers for specific file formats (e.g., Markdown, JSON, etc.)

## Adding a New Parser

To add support for a new file format, follow these steps:

### 1. Create a Parser Module

Create a new file in the `parsers/` directory (e.g., `parsers/json.js`):

```javascript
import { BaseParser } from './base.js';

export class JsonParser extends BaseParser {
  static getExtensions() {
    return ['.json'];
  }

  static parse(content) {
    try {
      const jsonData = JSON.parse(content);
      return this.formatJson(jsonData);
    } catch (error) {
      throw new Error(this.formatError(error, 'JSON file'));
    }
  }

  static formatJson(data, indent = 0) {
    // Your formatting logic here
    return JSON.stringify(data, null, 2);
  }
}
```

### 2. Register the Parser

Add your parser to `parsers/index.js`:

```javascript
import { JsonParser } from './json.js';

// Add this line to the parsers Map
parsers.set('json', JsonParser);
```

### 3. Parser Requirements

Every parser must:

- **Extend BaseParser**: All parsers must extend the `BaseParser` class
- **Implement `getExtensions()`**: Static method returning an array of supported file extensions
- **Implement `parse(content)`**: Static method that takes file content as string and returns formatted output
- **Use BaseParser utilities**: Leverage built-in methods like `formatError()`

#### BaseParser Features

The `BaseParser` class provides:

- **`formatError(error, filename)`**: Formats error messages consistently

### 4. Testing Your Parser

Test your parser with the CLI:

```bash
# Test with your new file format
node cli.js example.json
```

## Development Guidelines

### Code Style
- Use ES6+ features and modules
- Follow existing naming conventions
- Add proper error handling
- Use chalk for terminal styling

### Error Handling
- Throw descriptive errors for parsing failures
- Handle edge cases gracefully
- Provide helpful error messages to users

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
