import * as chrono from 'chrono-node';
import { Category } from '@core/models/category.model';

export interface ParsedQuickTask {
  task: string;
  category: string | null;
  date: Date | null;
  priority: number | null;
  tags: string[];
}

const PRIORITY_WORDS: Record<string, number> = {
  '1': 1,
  critical: 1,
  urgent: 1,
  '2': 2,
  high: 2,
  '3': 3,
  medium: 3,
  med: 3,
  normal: 3,
  '4': 4,
  low: 4,
};

const MIN_TAG_LENGTH = 2;
const MAX_TAG_LENGTH = 14;
const MAX_TAGS = 3;

/**
 * Turns a free-text quick-add string into structured todo fields — all offline,
 * no API calls. Recognises:
 *   - natural-language dates ("tomorrow 3pm", "next friday") via chrono-node
 *   - `#token` → category if it matches a known category, otherwise a tag
 *   - `!token` → priority (`!high`, `!1`…`!4`, `!critical`, `!low`, …)
 * Everything left over becomes the task title.
 */
export function parseQuickTask(input: string, categories: Category[] = []): ParsedQuickTask {
  let text = input.trim();

  const result: ParsedQuickTask = {
    task: '',
    category: null,
    date: null,
    priority: null,
    tags: [],
  };

  // --- Date (parse first so its span can be cut from the title) ---
  const parsed = chrono.parse(text, new Date(), { forwardDate: true });
  if (parsed.length) {
    const match = parsed[0];
    result.date = match.start.date();
    text = (text.slice(0, match.index) + ' ' + text.slice(match.index + match.text.length)).trim();
  }

  const categoryNames = new Set(categories.map((c) => c.name.toLowerCase()));

  // --- Priority: !token ---
  text = text
    .replace(/(^|\s)!([a-z0-9]+)/gi, (whole, lead: string, token: string) => {
      const priority = PRIORITY_WORDS[token.toLowerCase()];
      if (priority) {
        result.priority = priority;
        return ' ';
      }
      return whole;
    })
    .trim();

  // --- Category / tags: #token ---
  text = text
    .replace(/(^|\s)#([a-z0-9-]+)/gi, (whole, lead: string, token: string) => {
      const lower = token.toLowerCase();
      if (result.category === null && categoryNames.has(lower)) {
        result.category = categories.find((c) => c.name.toLowerCase() === lower)!.name;
        return ' ';
      }
      if (
        token.length >= MIN_TAG_LENGTH &&
        token.length <= MAX_TAG_LENGTH &&
        result.tags.length < MAX_TAGS &&
        !result.tags.includes(token)
      ) {
        result.tags.push(token);
        return ' ';
      }
      return whole;
    })
    .trim();

  result.task = text.replace(/\s{2,}/g, ' ').trim();

  return result;
}
