/**
 * @file CodePanel.tsx
 *
 * @description
 * IDE-style code viewer for the Code Studio.
 *
 * Features:
 *  - Full syntax highlighting via SyntaxHighlighter (no external library)
 *  - Operation-specific line highlight colours that mirror the canvas colours:
 *      compare   → amber  (matches canvas compare colour)
 *      swap      → rose   (matches canvas swap colour)
 *      overwrite → blue
 *      pivot     → violet
 *      done      → emerald
 *  - Language tabs with coloured dot badges
 *  - Mac-style window chrome + status bar
 *  - Auto-scroll: keeps the active line centred in the viewport
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { algorithmCodes } from './algorithmCode.ts';
import type { SupportedLanguage } from './algorithmCode.ts';
import { SyntaxHighlighter } from './SyntaxHighlighter.tsx';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CodePanelProps {
  algorithmId: string;
  activeOperation: string | null;
}

interface LangDef {
  id: SupportedLanguage;
  label: string;
  accent: string;
  badge: string;
}

const LANGUAGES: LangDef[] = [
  { id: 'python', label: 'Python', accent: '#3b82f6', badge: 'bg-blue-500' },
  { id: 'java', label: 'Java', accent: '#f97316', badge: 'bg-orange-500' },
  { id: 'javascript', label: 'JS', accent: '#eab308', badge: 'bg-yellow-400' },
  { id: 'c', label: 'C', accent: '#6366f1', badge: 'bg-indigo-500' },
  { id: 'cpp', label: 'C++', accent: '#06b6d4', badge: 'bg-cyan-500' },
  { id: 'csharp', label: 'C#', accent: '#a855f7', badge: 'bg-purple-500' },
];

interface HighlightStyle {
  bg: string;
  border: string;
  lineNum: string;
  text: string;
  label: string;
}

// Colours mirror the canvas renderer so bar colour == line highlight colour
const OPERATION_STYLES: Record<string, HighlightStyle> = {
  compare: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-400',
    lineNum: 'text-amber-400 font-bold',
    text: 'text-amber-100',
    label: 'compare',
  },
  swap: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-400',
    lineNum: 'text-rose-400 font-bold',
    text: 'text-rose-100',
    label: 'swap',
  },
  overwrite: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-400',
    lineNum: 'text-blue-400 font-bold',
    text: 'text-blue-100',
    label: 'write',
  },
  pivot: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-400',
    lineNum: 'text-violet-400 font-bold',
    text: 'text-violet-100',
    label: 'pivot',
  },
  done: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400',
    lineNum: 'text-emerald-400 font-bold',
    text: 'text-emerald-100',
    label: 'done',
  },
};

const DEFAULT_STYLE: HighlightStyle = {
  bg: '',
  border: 'border-transparent',
  lineNum: 'text-slate-600',
  text: '',
  label: '',
};

function getOperationHex(op: string | null): string {
  switch (op) {
    case 'compare':
      return '#f59e0b';
    case 'swap':
      return '#f43f5e';
    case 'overwrite':
      return '#3b82f6';
    case 'pivot':
      return '#8b5cf6';
    case 'done':
      return '#10b981';
    default:
      return '#6b7280';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CodePanel({ algorithmId, activeOperation }: CodePanelProps) {
  const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('python');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const snippet = useMemo(
    () => algorithmCodes[algorithmId]?.[activeLanguage] ?? null,
    [algorithmId, activeLanguage]
  );

  const activeLines = useMemo<number[]>(() => {
    if (!snippet || !activeOperation) return [];
    return snippet.lineMapping[activeOperation] ?? [];
  }, [snippet, activeOperation]);

  // Keep the first active line centred in the scroll container
  useEffect(() => {
    const container = scrollContainerRef.current;
    const element = activeLineRef.current;
    if (!container || !element) return;
    container.scrollTo({
      top: element.offsetTop - container.clientHeight / 2 + 12,
      behavior: 'smooth',
    });
  }, [activeLines]);

  if (!snippet) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0d1117] rounded-xl border border-slate-700/50 text-slate-500 text-sm">
        Code not available for this algorithm.
      </div>
    );
  }

  const codeLines = snippet.code.split('\n');
  const activeStyle = activeOperation
    ? (OPERATION_STYLES[activeOperation] ?? DEFAULT_STYLE)
    : DEFAULT_STYLE;
  const activeLangDef = LANGUAGES.find((l) => l.id === activeLanguage)!;

  return (
    <div className="relative flex flex-col w-full h-full bg-[#0d1117] rounded-xl border border-slate-700/50 shadow-xl overflow-hidden font-mono text-sm">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-[#161b22] border-b border-slate-700/50 shrink-0 min-w-0">
        {/* Mac window dots */}
        <div className="hidden sm:flex items-center gap-1.5 px-4 py-3 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>

        {/* Language tabs */}
        <div className="flex overflow-x-auto min-w-0 flex-1">
          {LANGUAGES.map((lang) => {
            const isActive = activeLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setActiveLanguage(lang.id)}
                style={isActive ? { borderColor: lang.accent, color: lang.accent } : undefined}
                className={`flex items-center gap-2 px-4 py-2.5 text-[10px] sm:text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'bg-white/5'
                    : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.03]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${lang.badge}`} />
                {lang.label}
              </button>
            );
          })}
        </div>

        {/* Live operation indicator */}
        {activeOperation && activeOperation !== 'done' && (
          <div
            className="hidden lg:flex items-center gap-1.5 px-3 mr-3 py-1 rounded text-[10px] font-black uppercase tracking-widest shrink-0"
            style={{
              color: getOperationHex(activeOperation),
              background: `${getOperationHex(activeOperation)}18`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
              style={{ background: getOperationHex(activeOperation) }}
            />
            {activeStyle.label || activeOperation}
          </div>
        )}
      </div>

      {/* ── CODE VIEWPORT ─────────────────────────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto py-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {codeLines.map((rawLine, index) => {
          const lineNumber = index + 1;
          const isActive = activeLines.includes(lineNumber);
          const style = isActive ? activeStyle : DEFAULT_STYLE;

          return (
            <div
              key={lineNumber}
              ref={isActive ? activeLineRef : null}
              className={`flex items-start min-w-0 px-3 border-l-2 transition-all duration-100 ${
                style.bg
              } ${style.border} ${!isActive ? 'hover:bg-white/[0.02]' : ''}`}
            >
              {/* Gutter */}
              <span
                className={`w-7 shrink-0 text-right pr-3 select-none text-[11px] pt-px leading-6 ${style.lineNum}`}
              >
                {lineNumber}
              </span>

              {/* Code — syntax-highlighted when inactive, solid colour when active */}
              <span
                className={`whitespace-pre flex-1 min-w-0 leading-6 ${isActive ? style.text : ''}`}
              >
                {isActive ? (
                  rawLine || '\u00a0'
                ) : (
                  <SyntaxHighlighter code={rawLine || '\u00a0'} language={activeLanguage} />
                )}
              </span>

              {/* Operation badge at line end */}
              {isActive && style.label && (
                <span
                  className={`hidden sm:inline-block shrink-0 ml-3 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded self-center ${style.lineNum}`}
                  style={{ background: `${getOperationHex(activeOperation)}18` }}
                >
                  {style.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── STATUS BAR ────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-1 bg-[#161b22] border-t border-slate-700/50 text-[10px] text-slate-500">
        <span className="font-medium" style={{ color: activeLangDef.accent }}>
          {activeLangDef.label}
        </span>
        <span>{codeLines.length} lines</span>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-6 left-0 w-full h-5 bg-linear-to-t from-[#0d1117] to-transparent pointer-events-none" />
    </div>
  );
}
