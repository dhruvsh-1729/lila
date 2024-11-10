import { uciChar } from './uciChar';
import { type NormalMove, type Chess, parseUci, makeUci } from 'chessops';
import { normalizeMove } from 'chessops/chess';

export * from './sanWriter';
export const initialFen: FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function fixCrazySan(san: San): San {
  return san[0] === 'P' ? san.slice(1) : san;
}

export function destsToUcis(dests: Dests): Uci[] {
  const ucis: string[] = [];
  for (const [orig, d] of dests) {
    d.forEach(function (dest) {
      ucis.push(orig + dest);
    });
  }
  return ucis;
}

export function readDests(lines?: string): Dests | null {
  if (typeof lines === 'undefined') return null;
  const dests = new Map();
  if (lines)
    for (const line of lines.split(' ')) {
      dests.set(
        uciChar[line[0]],
        line
          .slice(1)
          .split('')
          .map(c => uciChar[c]),
      );
    }
  return dests;
}

export function readDrops(line?: string | null): Key[] | null {
  if (typeof line === 'undefined' || line === null) return null;
  return (line.match(/.{2}/g) as Key[]) || [];
}

export function normalMove(chess: Chess, unsafeUci: Uci): { uci: Uci; move: NormalMove } | undefined {
  const unsafe = parseUci(unsafeUci);
  const move = unsafe && 'from' in unsafe ? { ...unsafe, ...normalizeMove(chess, unsafe) } : undefined;
  return move && chess.isLegal(move) ? { uci: makeUci(move), move } : undefined;
}
