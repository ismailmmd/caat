#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { ParserFactory } from './parsers/index.js';

const filePath = process.argv[2];

if (!filePath) {
  console.error(chalk.red("Error: Please provide a file"));
  console.error(chalk.yellow("Usage: caat <file>"));
  console.error(chalk.gray(`Supported formats: ${ParserFactory.getSupportedExtensions().join(', ')}`));
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(chalk.red(`Error: File '${filePath}' not found.`));
  process.exit(1);
}

try {
  const parser = ParserFactory.getParserByExtension(filePath);
  
  if (!parser) {
    const ext = path.extname(filePath).toLowerCase();
    console.error(chalk.red(`Error: Unsupported file format '${ext}'`));
    console.error(chalk.yellow(`Supported formats: ${ParserFactory.getSupportedExtensions().join(', ')}`));
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const output = parser.parse(content);
  console.log(output);
} catch (error) {
  console.error(chalk.red(`Error processing file: ${error.message}`));
  process.exit(1);
}
