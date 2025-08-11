import path from 'path';
import { ParserInterface } from "./parser-interface.js";
import { MarkdownParser } from "./md.js";

const parsers = new Map<string, ParserInterface>();

// Register parsers
parsers.set('markdown', new MarkdownParser());

/**
 * Factory class for managing and retrieving file parsers
 */
export class ParserFactory {
  static getParserByExtension(filePath: string): ParserInterface | null {
    const ext = path.extname(filePath).toLowerCase();
    
    for (const parser of parsers.values()) {
      if (parser.getExtensions().includes(ext)) {
        return parser;
      }
    }
    
    return null;
  }

  static getSupportedExtensions(): string[] {
    const extensions: string[] = [];
    for (const parser of parsers.values()) {
      extensions.push(...parser.getExtensions());
    }
    return [...new Set(extensions)];
  }
}
