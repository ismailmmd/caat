import { marked } from 'marked';
import chalk from 'chalk';
import { ParserInterface } from "./parser-interface.js";

export class MarkdownParser implements ParserInterface {
  getExtensions(): string[] {
    return ['.md', '.markdown'];
  }

  parse(content: string): string {
    try {
      const htmlOutput = marked.parse(content) as string;
      return this.htmlToTerminal(htmlOutput);
    } catch (error) {
      throw new Error(`Error parsing markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Converts HTML to styled terminal output
   * @param html - HTML string to convert
   * @returns Styled terminal output
   */
  private htmlToTerminal(html: string): string {
    let output = html;

    // Replace code blocks with language specification
    output = output.replace(/<pre><code[^>]*class="language-([^"]*)"[^>]*>(.*?)<\/code><\/pre>/gs, (_, lang: string, code: string) => {
      return this.renderCodeBlock(code, lang);
    });

    // Replace code blocks without language specification
    output = output.replace(/<pre><code[^>]*>(.*?)<\/code><\/pre>/gs, (_, code: string) => {
      return this.renderCodeBlock(code);
    });

    // Replace inline code
    output = output.replace(/<code[^>]*>(.*?)<\/code>/g, (_, code: string) => {
      return chalk.dim('`') + chalk.cyan(code) + chalk.dim('`');
    });

    // Replace HTML headings with styled versions
    output = output.replace(/<h1[^>]*>(.*?)<\/h1>/g, (_, text: string) => {
      return chalk.bold.underline.magenta(text.replace(/<[^>]*>/g, '')) + '\n\n';
    });

    output = output.replace(/<h2[^>]*>(.*?)<\/h2>/g, (_, text: string) => {
      return chalk.bold.cyan(text.replace(/<[^>]*>/g, '')) + '\n\n';
    });

    output = output.replace(/<h3[^>]*>(.*?)<\/h3>/g, (_, text: string) => {
      return chalk.bold.yellow(text.replace(/<[^>]*>/g, '')) + '\n';
    });

    output = output.replace(/<h[456][^>]*>(.*?)<\/h[456]>/g, (_, text: string) => {
      return chalk.bold.green(text.replace(/<[^>]*>/g, '')) + '\n';
    });

    // Replace strong/bold
    output = output.replace(/<strong[^>]*>(.*?)<\/strong>/g, (_, text: string) => {
      return chalk.bold(text);
    });

    output = output.replace(/<b[^>]*>(.*?)<\/b>/g, (_, text: string) => {
      return chalk.bold(text);
    });

    // Replace emphasis/italic
    output = output.replace(/<em[^>]*>(.*?)<\/em>/g, (_, text: string) => {
      return chalk.italic(text);
    });

    output = output.replace(/<i[^>]*>(.*?)<\/i>/g, (_, text: string) => {
      return chalk.italic(text);
    });

    // Replace paragraphs
    output = output.replace(/<p[^>]*>(.*?)<\/p>/gs, (_, text: string) => {
      return text.replace(/<[^>]*>/g, '') + '\n\n';
    });

    // Replace links with clickable terminal hyperlinks
    output = output.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, (_, href: string, text: string) => {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const clickableLink = `\u001b]8;;${href}\u001b\\${chalk.blue.underline(cleanText)}\u001b]8;;\u001b\\`;
      return clickableLink;
    });

    // Replace blockquotes
    output = output.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gs, (_, quote: string) => {
      const cleanQuote = quote.replace(/<[^>]*>/g, '').trim();
      const lines = cleanQuote.split('\n');
      const styledLines = lines.map((line: string) => line.trim() ? chalk.gray('│ ') + line : '');
      return '\n' + styledLines.join('\n') + '\n\n';
    });

    // Replace unordered lists
    output = output.replace(/<ul[^>]*>(.*?)<\/ul>/gs, (_, listContent: string) => {
      const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
      const styledItems = items.map((item: string) => {
        const text = item.replace(/<\/?li[^>]*>/g, '').replace(/<[^>]*>/g, '').trim();
        return chalk.green('• ') + text;
      });
      return styledItems.join('\n') + '\n\n';
    });

    // Replace ordered lists
    output = output.replace(/<ol[^>]*>(.*?)<\/ol>/gs, (_, listContent: string) => {
      const items = listContent.match(/<li[^>]*>(.*?)<\/li>/gs) || [];
      const styledItems = items.map((item: string, i: number) => {
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

  /**
   * Renders a code block with optional language syntax highlighting
   * @param code - Code content to render
   * @param language - Optional language for syntax highlighting
   * @returns Formatted code block
   */
  private renderCodeBlock(code: string, language?: string | null): string {
    const cleanCode = code.trim();
    const lines = cleanCode.split('\n');

    const contentWidth = Math.max(...lines.map((l: string) => l.length));
    const labelWidth = language ? `─ ${language} ─`.length : 0;
    const innerWidth = Math.max(contentWidth, labelWidth);

    let topBorder: string;
    if (language) {
      const label = `─ ${language} ─`;
      const extraDashes = innerWidth - label.length;
      topBorder = chalk.dim(`┌${label}${'─'.repeat(extraDashes + 2)}┐`);
    } else {
      topBorder = chalk.dim(`┌${'─'.repeat(innerWidth + 2)}┐`);
    }

    const paddedLines = lines.map((line: string) =>
      chalk.dim('│ ') + chalk.cyan(line) + ' '.repeat(innerWidth - line.length) + chalk.dim(' │')
    );

    const bottomBorder = chalk.dim(`└${'─'.repeat(innerWidth + 2)}┘`);

    return '\n' + topBorder + '\n' + paddedLines.join('\n') + '\n' + bottomBorder + '\n\n';
  }
}
