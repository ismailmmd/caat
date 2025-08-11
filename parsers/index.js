import path from 'path';
import { MarkdownParser } from './md.js';

const parsers = new Map();

// Set of all supported file extensions
parsers.set('markdown', MarkdownParser);

export class ParserFactory {
  static getParserByExtension(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    for (const parser of parsers.values()) {
      if (parser.getExtensions().includes(ext)) {
        return parser;
      }
    }
    
    return null;
  }

  static getSupportedExtensions() {
    const extensions = [];
    for (const parser of parsers.values()) {
      extensions.push(...parser.getExtensions());
    }
    return [...new Set(extensions)];
  }

}
