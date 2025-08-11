import { marked } from 'marked';
import chalk from 'chalk';
import { BaseParser } from './base.js';

export class MarkdownParser extends BaseParser {
  static getExtensions() {
    return ['.md', '.markdown'];
  }

  static parse(content) {
    try {
      const htmlOutput = marked.parse(content);
      return this.htmlToTerminal(htmlOutput);
    } catch (error) {
      throw new Error(this.formatError(error));
    }
  }

  static htmlToTerminal(html) {
    let output = html;

    output = output.replace(/<pre><code[^>]*class="language-([^"]*)"[^>]*>(.*?)<\/code><\/pre>/gs, (_, lang, code) => {
      return this.renderCodeBlock(code, lang);
    });

    output = output.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gs, (_, code) => {
      return this.renderCodeBlock(code);
    });

    output = output.replace(/<code[^>]*>(.*?)<\/code>/g, (_, code) => {
      return chalk.dim('`') + chalk.cyan(code) + chalk.dim('`');
    });

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

    output = output.replace(/<p[^>]*>(.*?)<\/p>/gs, (_, text) => {
      return text.replace(/<[^>]*>/g, '') + '\n\n';
    });

    output = output.replace(/<strong[^>]*>(.*?)<\/strong>/g, (_, text) => {
      return chalk.bold(text);
    });

    output = output.replace(/<b[^>]*>(.*?)<\/b>/g, (_, text) => {
      return chalk.bold(text);
    });

    output = output.replace(/<em[^>]*>(.*?)<\/em>/g, (_, text) => {
      return chalk.italic(text);
    });

    output = output.replace(/<i[^>]*>(.*?)<\/i>/g, (_, text) => {
      return chalk.italic(text);
    });

    output = output.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, (_, href, text) => {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const clickableLink = `\u001b]8;;${href}\u001b\\${chalk.blue.underline(cleanText)}\u001b]8;;\u001b\\`;
      return clickableLink;
    });

    output = output.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gs, (_, quote) => {
      const cleanQuote = quote.replace(/<[^>]*>/g, '').trim();
      const lines = cleanQuote.split('\n');
      const styledLines = lines.map(line => line.trim() ? chalk.gray('│ ') + line : '');
      return '\n' + styledLines.join('\n') + '\n\n';
    });

    output = output.replace(/<ul[^>]*>(.*?)<\/ul>/gs, (_, listContent) => {
      const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
      const styledItems = items.map(item => {
        const text = item.replace(/<\/?li[^>]*>/g, '').replace(/<[^>]*>/g, '').trim();
        return chalk.green('• ') + text;
      });
      return styledItems.join('\n') + '\n\n';
    });

    output = output.replace(/<ol[^>]*>(.*?)<\/ol>/gs, (_, listContent) => {
      const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
      const styledItems = items.map((item, i) => {
        const text = item.replace(/<\/?li[^>]*>/g, '').replace(/<[^>]*>/g, '').trim();
        return chalk.blue(`${i + 1}. `) + text;
      });
      return styledItems.join('\n') + '\n\n';
    });

    output = output.replace(/<[^>]*>/g, '');

    output = output.replace(/&quot;/g, '"');
    output = output.replace(/&#39;/g, "'");
    output = output.replace(/&lt;/g, '<');
    output = output.replace(/&gt;/g, '>');
    output = output.replace(/&amp;/g, '&');

    output = output.replace(/\n{3,}/g, '\n\n');

    return output.trim() + '\n';
  }

  static renderCodeBlock(code, language = null) {
    const cleanCode = code.trim();
    const lines = cleanCode.split('\n');

    const contentWidth = Math.max(...lines.map(l => l.length));
    const labelWidth = language ? `─ ${language} ─`.length : 0;
    const innerWidth = Math.max(contentWidth, labelWidth);

    let topBorder;
    if (language) {
      const label = `─ ${language} ─`;
      const extraDashes = innerWidth - label.length;
      topBorder = chalk.dim(`┌${label}${'─'.repeat(extraDashes + 2)}┐`);
    } else {
      topBorder = chalk.dim(`┌${'─'.repeat(innerWidth + 2)}┐`);
    }

    const paddedLines = lines.map(line =>
      chalk.dim('│ ') + chalk.cyan(line) + ' '.repeat(innerWidth - line.length) + chalk.dim(' │')
    );

    const bottomBorder = chalk.dim(`└${'─'.repeat(innerWidth + 2)}┘`);

    return '\n' + topBorder + '\n' + paddedLines.join('\n') + '\n' + bottomBorder + '\n\n';
  }
}