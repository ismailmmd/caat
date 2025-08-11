export class BaseParser {
  static getExtensions() {
    throw new Error('getExtensions() must be implemented by parser subclass');
  }

  static parse(content) {
    throw new Error('parse() must be implemented by parser subclass');
  }

  static formatError(error, filename = 'file') {
    return `Error parsing ${filename}: ${error.message}`;
  }
}
