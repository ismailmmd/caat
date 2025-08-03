# caat

![npm](https://img.shields.io/npm/dt/@slowcode/caat)

A CLI tool that converts Markdown files to beautifully styled terminal output with colors and formatting.

![alt text](image.png)

Why **caat**? Just like the Unix `cat` command concatenates and displays files, **caat** (Cat-like Advanced Appearance Tool) takes it a step further by elegantly displaying your markdown with style! 🐱 It's the purr-fect alternative to plain `cat` for reading Markdown files - because who wants to stare at raw markup when you can have rainbow-colored, properly formatted prose? 🌈✨

## Installation

Install globally via npm:

```bash
npm install -g @slowcode/caat
```

## Usage

```bash
caat <markdown-file>
```

### Examples

```bash
# Display a README file
caat README.md

# Display any markdown file
caat docs/guide.md
```

## Features

- ✨ Styled headings with different colors (H1-H6)
- 📝 Formatted paragraphs and text
- 💻 Syntax-highlighted code blocks
- 🔗 Clickable links with URLs
- 📋 Styled lists (ordered and unordered)
- 📖 Formatted blockquotes
- **Bold** and *italic* text support
- `Inline code` highlighting

## Requirements

- Node.js >= 16.0.0

## Contributing

Contributions are welcome! Here's how you can help improve caat:

### Development Setup

**Test the CLI locally**:
   ```bash
   npm install
   npm test
   node cli.js test.md # read markdown file using caat
   ```

### Making Changes

Follow [GitHub's open source contribution guidelines](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) for best practices.

### Release Process

1. **Update version and push**:
   ```bash
   npm run release:patch  # for bug fixes (1.0.0 → 1.0.1)
   npm run release:minor  # for new features (1.0.0 → 1.1.0)
   npm run release:major  # for breaking changes (1.0.0 → 2.0.0)
   ```

2. **Create a GitHub release**:
   - Go to GitHub > Releases > Create a new release
   - Use the git tag created by npm version (e.g., `v1.0.2`)
   - The CI/CD pipeline will automatically use the release tag version for npm publishing

## License

MIT
