#!/usr/bin/env node

import fs from 'fs';
import { marked } from 'marked';
import chalk from 'chalk';

const filePath = process.argv[2];
if (!filePath) {
  console.error(chalk.red("Error: Please provide a markdown file"));
  console.error(chalk.yellow("Usage: caat <markdown-file>"));
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(chalk.red(`Error: File '${filePath}' not found.`));
  process.exit(1);
}

try {
  const md = fs.readFileSync(filePath, "utf8");
  const htmlOutput = marked.parse(md);
  console.log(htmlToTerminal(htmlOutput));
} catch (error) {
  console.error(chalk.red(`Error reading file: ${error.message}`));
  process.exit(1);
}

function htmlToTerminal(html) {
  let output = html;

  // Replace code blocks
  output = output.replace(/<pre><code[^>]*class="language-([^"]*)"[^>]*>(.*?)<\/code><\/pre>/gs, (_, lang, code) => {
    return renderCodeBlock(code, lang);
  });

  output = output.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gs, (_, code) => {
    return renderCodeBlock(code);
  });

  // Replace inline code
  output = output.replace(/<code[^>]*>(.*?)<\/code>/g, (_, code) => {
    return chalk.dim('`') + chalk.cyan(code) + chalk.dim('`');
  });

  // Replace HTML headings with styled versions
  output = output.replace(/<h1[^>]*>(.*?)<\/h1>/g, (_, text) => {
    return chalk.bold.underline.magenta(text.replace(/<[^>]*>/g, '')) + '\n\n';
  });

  output = output.replace(/<h2[^>]*>(.*?)<\/h2>/g, (_, text) => {
    return chalk.bold.cyan(text.replace(/<[^>]*>/g, '')) + '\n\n';
  });

  output = output.replace(/<h3[^>]*>(.*?)<\/h3>/g, (_, text) => {
    return chalk.bold.yellow(text.replace(/<[^>]*>/g, '')) + '\n';
  });

  output = output.replace(/<h[456][^>]*>(.*?)<\/h[456]>/g, (_, text) => {
    return chalk.bold.green(text.replace(/<[^>]*>/g, '')) + '\n';
  });

  // Replace paragraphs
  output = output.replace(/<p[^>]*>(.*?)<\/p>/gs, (_, text) => {
    return text.replace(/<[^>]*>/g, '') + '\n\n';
  });


  // Replace inline code
  output = output.replace(/<code[^>]*>(.*?)<\/code>/g, (_, code) => {
    return chalk.dim('`') + chalk.cyan(code) + chalk.dim('`');
  });

  // Replace strong/bold
  output = output.replace(/<strong[^>]*>(.*?)<\/strong>/g, (_, text) => {
    return chalk.bold(text);
  });

  output = output.replace(/<b[^>]*>(.*?)<\/b>/g, (_, text) => {
    return chalk.bold(text);
  });

  // Replace emphasis/italic
  output = output.replace(/<em[^>]*>(.*?)<\/em>/g, (_, text) => {
    return chalk.italic(text);
  });

  output = output.replace(/<i[^>]*>(.*?)<\/i>/g, (_, text) => {
    return chalk.italic(text);
  });

  // Replace links with clickable terminal hyperlinks
  output = output.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, (_, href, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '');
    const clickableLink = `\u001b]8;;${href}\u001b\\${chalk.blue.underline(cleanText)}\u001b]8;;\u001b\\`;
    return clickableLink;
  });

  // Replace blockquotes
  output = output.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gs, (_, quote) => {
    const cleanQuote = quote.replace(/<[^>]*>/g, '').trim();
    const lines = cleanQuote.split('\n');
    const styledLines = lines.map(line => line.trim() ? chalk.gray('│ ') + line : '');
    return '\n' + styledLines.join('\n') + '\n\n';
  });

  // Replace unordered lists
  output = output.replace(/<ul[^>]*>(.*?)<\/ul>/gs, (_, listContent) => {
    const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
    const styledItems = items.map(item => {
      const text = item.replace(/<\/?li[^>]*>/g, '').replace(/<[^>]*>/g, '').trim();
      return chalk.green('• ') + text;
    });
    return styledItems.join('\n') + '\n\n';
  });

  // Replace ordered lists
  output = output.replace(/<ol[^>]*>(.*?)<\/ol>/gs, (_, listContent) => {
    const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
    const styledItems = items.map((item, i) => {
      const text = item.replace(/<\/?li[^>]*>/g, '').replace(/<[^>]*>/g, '').trim();
      return chalk.blue(`${i + 1}. `) + text;
    });
    return styledItems.join('\n') + '\n\n';
  });

  // Remove any remaining HTML tags
  output = output.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  output = output.replace(/&quot;/g, '"');
  output = output.replace(/&#39;/g, "'");
  output = output.replace(/&lt;/g, '<');
  output = output.replace(/&gt;/g, '>');
  output = output.replace(/&amp;/g, '&');

  // Clean up excessive newlines
  output = output.replace(/\n{3,}/g, '\n\n');

  return output.trim() + '\n';
}

const renderCodeBlock = (code, language = null) => {
  const cleanCode = code.trim();
  const lines = cleanCode.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length), language ? language.length + 4 : 5);

  const topBorder = language
    ? chalk.dim(`┌─ ${language} ─${'─'.repeat(Math.max(0, maxLength - language.length - 3))}┐`)
    : chalk.dim('┌' + '─'.repeat(maxLength + 2) + '┐');

  const paddedLines = lines.map(line =>
    chalk.dim('│ ') + chalk.cyan(line) + ' '.repeat(Math.max(0, maxLength - line.length)) + chalk.dim(' │')
  );

  const bottomBorder = chalk.dim('└' + '─'.repeat(maxLength + 2) + '┘');
  return '\n' + topBorder + '\n' + paddedLines.join('\n') + '\n' + bottomBorder + '\n\n';
};
