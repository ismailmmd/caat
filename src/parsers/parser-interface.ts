/**
 * Interface defining the contract for file parsers
 */
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
