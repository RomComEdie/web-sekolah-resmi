/**
 * Utility Security Engine for Toxic Content Moderation & Rate Limiting
 */

// Common toxic / inappropriate words filter (Indonesian & slang)
const TOXIC_WORDS_DICTIONARY = [
  'anjing', 'anjingg', 'anjrit', 'anjir', 'babi', 'kontol', 'kentuk', 'memek', 
  'pepek', 'goblok', 'tolol', 'bangsat', 'bajingan', 'lonte', 'perek', 
  'asu', 'jancok', 'pantat', 'pantek', 'bodoh', 'pemuak', 'setan', 'iblis',
  'biadab', 'bego', 'monyet', 'idiot', 'pukimak', 'kimak', 'bgst', 'kntl',
  'mmk', 'asw', 'jnck', 'fuck', 'shit', 'bitch', 'asshole', 'bastard'
];

export interface ToxicCheckResult {
  isToxic: boolean;
  detectedWord?: string;
}

/**
 * Check if the text contains toxic / abusive language.
 */
export function checkToxicWords(text: string): ToxicCheckResult {
  if (!text) return { isToxic: false };
  
  // Clean and normalize text
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');

  const words = normalized.split(' ');

  for (const toxicWord of TOXIC_WORDS_DICTIONARY) {
    // Check exact word match or substring in suspicious short words
    const foundExact = words.includes(toxicWord);
    const foundSubstring = toxicWord.length >= 4 && normalized.includes(toxicWord);

    if (foundExact || foundSubstring) {
      return {
        isToxic: true,
        detectedWord: toxicWord
      };
    }
  }

  return { isToxic: false };
}

export interface RateLimitResult {
  allowed: boolean;
  waitSeconds?: number;
}

/**
 * Client-Side Rate Limiter based on LocalStorage timestamps
 */
export function checkRateLimit(actionKey: string, cooldownSeconds: number = 20): RateLimitResult {
  try {
    const storageKey = `smk_rate_limit_${actionKey}`;
    const lastTimestampStr = localStorage.getItem(storageKey);
    const now = Date.now();

    if (lastTimestampStr) {
      const lastTimestamp = parseInt(lastTimestampStr, 10);
      const elapsedSeconds = (now - lastTimestamp) / 1000;

      if (elapsedSeconds < cooldownSeconds) {
        const waitSeconds = Math.ceil(cooldownSeconds - elapsedSeconds);
        return {
          allowed: false,
          waitSeconds
        };
      }
    }

    return { allowed: true };
  } catch (err) {
    return { allowed: true }; // Fallback allow if localStorage restricted
  }
}

/**
 * Record action completion timestamp for rate limiting
 */
export function recordActionTimestamp(actionKey: string): void {
  try {
    const storageKey = `smk_rate_limit_${actionKey}`;
    localStorage.setItem(storageKey, Date.now().toString());
  } catch (e) {
    // ignore
  }
}
