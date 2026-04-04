/**
 * @file SyntaxHighlighter.tsx
 *
 * @description
 * A zero-dependency, language-aware syntax highlighter for the Code Studio.
 * Tokenizes source code using a priority-ordered regex scanner and renders
 * each token as a styled <span> with VS Code–inspired colours.
 *
 * Supported token types (in scan priority order):
 *   comment → string → identifier (keyword | type | function | plain) → number → operator → punctuation → whitespace
 *
 * No Prism, no Shiki, no runtime network requests — just React.
 */

import React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SupportedLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'c' | 'csharp';

type TokenType =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'function'
  | 'type'
  | 'operator'
  | 'punctuation'
  | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

// ─── Language data ────────────────────────────────────────────────────────────

const KEYWORDS: Record<SupportedLanguage, Set<string>> = {
  javascript: new Set([
    'function',
    'let',
    'var',
    'const',
    'for',
    'while',
    'if',
    'else',
    'return',
    'new',
    'of',
    'in',
    'typeof',
    'true',
    'false',
    'null',
    'undefined',
    'class',
    'this',
    'break',
    'continue',
  ]),
  python: new Set([
    'def',
    'for',
    'while',
    'if',
    'else',
    'elif',
    'return',
    'in',
    'not',
    'and',
    'or',
    'True',
    'False',
    'None',
    'import',
    'from',
    'class',
    'pass',
    'break',
    'continue',
    'with',
    'as',
    'lambda',
  ]),
  java: new Set([
    'public',
    'private',
    'protected',
    'static',
    'void',
    'for',
    'while',
    'if',
    'else',
    'return',
    'new',
    'class',
    'import',
    'true',
    'false',
    'null',
    'final',
    'boolean',
    'int',
    'long',
    'double',
    'float',
  ]),
  cpp: new Set([
    'void',
    'int',
    'long',
    'double',
    'float',
    'bool',
    'for',
    'while',
    'if',
    'else',
    'return',
    'new',
    'class',
    'true',
    'false',
    'nullptr',
    'auto',
    'const',
    'template',
    'typename',
    'struct',
    'namespace',
  ]),
  c: new Set([
    'void',
    'int',
    'long',
    'double',
    'float',
    'char',
    'for',
    'while',
    'if',
    'else',
    'return',
    'struct',
    'typedef',
    'sizeof',
    'NULL',
    'const',
    'static',
    'unsigned',
  ]),
  csharp: new Set([
    'public',
    'private',
    'protected',
    'static',
    'void',
    'int',
    'long',
    'double',
    'float',
    'bool',
    'string',
    'for',
    'while',
    'if',
    'else',
    'return',
    'new',
    'class',
    'using',
    'true',
    'false',
    'null',
    'var',
    'const',
    'readonly',
    'this',
    'base',
  ]),
};

const TYPES: Record<SupportedLanguage, Set<string>> = {
  javascript: new Set([
    'Math',
    'Array',
    'String',
    'Object',
    'Number',
    'Boolean',
    'Promise',
    'console',
  ]),
  python: new Set([
    'range',
    'len',
    'max',
    'min',
    'list',
    'dict',
    'set',
    'tuple',
    'int',
    'str',
    'print',
    'sorted',
    'reversed',
  ]),
  java: new Set([
    'Arrays',
    'List',
    'ArrayList',
    'String',
    'Integer',
    'Math',
    'System',
    'Collections',
  ]),
  cpp: new Set([
    'vector',
    'string',
    'pair',
    'map',
    'set',
    'max_element',
    'min_element',
    'swap',
    'sort',
  ]),
  c: new Set(['malloc', 'calloc', 'free', 'sizeof', 'printf', 'fprintf', 'memcpy', 'memset']),
  csharp: new Set(['List', 'Array', 'String', 'Math', 'Console', 'Enumerable', 'Linq']),
};

// Comment prefix(es) per language
const COMMENT_PREFIXES: Record<SupportedLanguage, string[]> = {
  javascript: ['//'],
  python: ['#'],
  java: ['//'],
  cpp: ['//'],
  c: ['//'],
  csharp: ['//'],
};

// ─── VS Code–inspired token colours ──────────────────────────────────────────

const COLORS: Record<TokenType, React.CSSProperties> = {
  keyword: { color: '#c792ea' }, // violet
  string: { color: '#c3e88d' }, // green
  number: { color: '#f78c6c' }, // orange
  comment: { color: '#546e7a', fontStyle: 'italic' }, // muted slate
  function: { color: '#82aaff' }, // blue
  type: { color: '#ffcb6b' }, // golden
  operator: { color: '#89ddff' }, // cyan
  punctuation: { color: '#89ddff' }, // cyan (same family)
  plain: { color: '#abb2bf' }, // light gray
};

// ─── Tokenizer ────────────────────────────────────────────────────────────────

/**
 * Scans a single line of code and produces an ordered array of tokens.
 * Uses a priority-ordered character-by-character loop so the first matching
 * rule wins — identical to how most hand-written lexers work.
 */
function tokenizeLine(line: string, language: SupportedLanguage): Token[] {
  const keywords = KEYWORDS[language];
  const types = TYPES[language];
  const commentPrefixes = COMMENT_PREFIXES[language];

  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // ── 1. Line comment ──────────────────────────────────────────────────────
    const restOfLine = line.slice(i);
    const isComment = commentPrefixes.some((p) => restOfLine.startsWith(p));
    if (isComment) {
      tokens.push({ type: 'comment', value: restOfLine });
      break; // rest of line is a comment
    }

    // ── 2. String (double-quote) ─────────────────────────────────────────────
    if (line[i] === '"') {
      let j = i + 1;
      while (j < line.length && !(line[j] === '"' && line[j - 1] !== '\\')) j++;
      j = Math.min(j + 1, line.length);
      tokens.push({ type: 'string', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // ── 3. String (single-quote) ─────────────────────────────────────────────
    if (line[i] === "'") {
      let j = i + 1;
      while (j < line.length && !(line[j] === "'" && line[j - 1] !== '\\')) j++;

      j = Math.min(j + 1, line.length);
      tokens.push({ type: 'string', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // ── 4. Identifier (keyword | type | function | plain) ────────────────────
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;

      const word = line.slice(i, j);

      let type: TokenType;
      if (keywords.has(word)) {
        type = 'keyword';
      } else if (types.has(word)) {
        type = 'type';
      } else {
        // Look ahead past whitespace for '(' to detect function calls
        let k = j;
        while (k < line.length && line[k] === ' ') k++;
        type = k < line.length && line[k] === '(' ? 'function' : 'plain';
      }

      tokens.push({ type, value: word });
      i = j;
      continue;
    }

    // ── 5. Number ────────────────────────────────────────────────────────────
    if (/\d/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\d.]/.test(line[j])) j++;
      tokens.push({ type: 'number', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // ── 6. Operator ──────────────────────────────────────────────────────────
    if (/[+\-*/%=<>!&|^~?]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[+\-*/%=<>!&|^~?]/.test(line[j])) j++;
      tokens.push({ type: 'operator', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // ── 7. Punctuation ───────────────────────────────────────────────────────
    if (/[()[\]{};:,.]/.test(line[i])) {
      tokens.push({ type: 'punctuation', value: line[i] });
      i++;
      continue;
    }

    // ── 8. Whitespace / anything else (preserve exactly) ────────────────────
    tokens.push({ type: 'plain', value: line[i] });
    i++;
  }

  return tokens;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SyntaxHighlighterProps {
  /** The raw source code string (may contain newlines). */
  code: string;
  /** Programming language — determines keyword sets and comment style. */
  language: SupportedLanguage;
}

/**
 * Renders syntax-highlighted code as inline React spans.
 * Each line is tokenized independently; the rendered output
 * preserves all whitespace and is safe to place inside a `<pre>`.
 */
export function SyntaxHighlighter({ code, language }: SyntaxHighlighterProps) {
  const lines = code.split('\n');

  return (
    <>
      {/**<React.Fragment>. We use this instead of a <div>
         because <div> is a block element and would force weird layouts. Fragments are invisible wrappers.
       */}
      {lines.map((line, lineIdx) => {
        const tokens = tokenizeLine(line, language);
        return (
          <React.Fragment key={lineIdx}>
            {tokens.map((token, tokenIdx) => (
              <span key={tokenIdx} style={COLORS[token.type]}>
                {token.value}
              </span>
            ))}
            {/* Preserve the newline so layout matches the raw string */}
            {lineIdx < lines.length - 1 && '\n'}
          </React.Fragment>
        );
      })}
    </>
  );
}
