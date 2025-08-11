#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { ParserFactory } from "./parsers/index.js";

/**
 * Main CLI function to process files
 */
function main(): void {
  const filePath: string | undefined = process.argv[2];

  // Check if file path is provided
  if (!filePath) {
    console.error(chalk.red("Error: Please provide a file"));
    console.error(chalk.yellow("Usage: caat <file>"));
    console.error(chalk.gray(`Supported formats: ${ParserFactory.getSupportedExtensions().join(', ')}`));
    process.exit(1);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`Error: File '${filePath}' not found.`));
    process.exit(1);
  }

  try {
    // Find appropriate parser for the file
    const parser = ParserFactory.getParserByExtension(filePath);
    
    if (!parser) {
      const ext: string = path.extname(filePath).toLowerCase();
      console.error(chalk.red(`Error: Unsupported file format '${ext}'`));
      console.error(chalk.yellow(`Supported formats: ${ParserFactory.getSupportedExtensions().join(', ')}`));
      process.exit(1);
    }

    // Read and parse the file
    const content: string = fs.readFileSync(filePath, "utf8");
    const output: string = parser.parse(content);
    console.log(output);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(chalk.red(`Error processing file: ${errorMessage}`));
    process.exit(1);
  }
}

// Run the CLI
main();
