# tomd

A CLI tool that converts Markdown files to beautifully styled terminal output with colors and formatting.

## Installation

Install globally via npm:

```bash
npm install -g @slowcode/tomd
```

## Usage

```bash
tomd <markdown-file>
```

### Examples

```bash
# Display a README file
tomd README.md

# Display any markdown file
tomd docs/guide.md
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

Contributions are welcome! Here's how you can help improve tomd:

### Development Setup

**Test the CLI locally**:
   ```bash
   npm install
   npm test
   node cli.js test.md # read markdown file using tomd
   ```

### Making Changes

Follow [GitHub's open source contribution guidelines](https://docs.github.com/en/get-started/quickstart/contributing-to-projects) for best practices.

### Release Process

#### Option 1: Automated Release (Recommended)

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

#### Option 2: Manual Version Control

1. **Update version**:
   ```bash
   npm run version:patch  # for bug fixes (1.0.0 → 1.0.1)
   npm run version:minor  # for new features (1.0.0 → 1.1.0)
   npm run version:major  # for breaking changes (1.0.0 → 2.0.0)
   ```

2. **Push changes and tags**:
   ```bash
   git push origin main --follow-tags
   ```

3. **Create a GitHub release**:
   - Use the git tag created by npm version
   - The CI/CD pipeline will automatically update package.json version from the release tag

## License

MIT
