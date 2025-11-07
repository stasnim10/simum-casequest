// Rule-based HintService for CaseQuest.
// Stable, defensive, and easy to extend (swap in model-driven hints later).

class HintService {
  constructor() {
    this.baseHints = {
      profitability: [
        'Break down profit into Revenue - Costs. Start by listing revenue drivers and major cost buckets.',
        'For revenue, separate Price × Volume and note any recent trend shifts or seasonality effects.',
        'Split costs into fixed versus variable and focus on the line items that move most with volume.',
        'Prioritize the biggest impact levers first (large price moves, major cost categories, volume swings).'
      ],
      framework_selection: [
        'Pick a framework that mirrors the client goal (growth, profitability, market entry, etc.).',
        'Start broad, then plan your deep dives: think Situation → Drivers → Synthesis.',
        'State a quick hypothesis, then structure supporting buckets to prove or disprove it.',
        'Balance completeness with focus — three crisp buckets often beat five unfocused ones.'
      ],
      data_interpretation: [
        'Double-check units and time ranges — misaligned units are a classic error.',
        'Look for outliers and validate whether they are real signals or data noise.',
        'Compare percentage changes when absolute values differ a lot in scale.',
        'If a number feels odd, sanity-check it against a known benchmark or prior period.'
      ],
      recommendation_structuring: [
        'Open with a headline recommendation, then share 2–3 supporting points with impact and effort.',
        'Quantify impact where possible (revenue lift, cost savings, timeline).',
        'State top assumptions and risks so leadership knows where to probe.',
        'Clarify quick wins versus longer initiatives, and assign owners or next steps.'
      ]
    };

    this.customHints = {};
  }

  registerHints(key, hintArray) {
    if (!key || !Array.isArray(hintArray) || hintArray.length === 0) return;
    this.customHints[key] = (this.customHints[key] || []).concat(hintArray);
  }

  getHintsForKey(key) {
    const base = this.baseHints[key] || [];
    const custom = this.customHints[key] || [];
    return [...base, ...custom];
  }

  getCategoryFromContext(caseContext = {}) {
    const type = (caseContext.type || '').toString().toLowerCase();
    const step = (caseContext.step || '').toString().toLowerCase();

    if (type.includes('profit')) return 'profitability';
    if (type.includes('market') || type.includes('sizing')) return 'framework_selection';
    if (step.includes('framework')) return 'framework_selection';
    if (step.includes('data') || step.includes('analysis') || step.includes('interpret')) return 'data_interpretation';
    if (step.includes('recommend') || step.includes('conclude')) return 'recommendation_structuring';
    return 'framework_selection';
  }

  getHint(caseContext = {}, userProgress = {}) {
    const category = this.getCategoryFromContext(caseContext);
    const hints = this.getHintsForKey(category);
    if (!hints || hints.length === 0) {
      return "Try reframing the problem: what's the core question we must answer for the client?";
    }

    const hintsUsed = userProgress && Number.isFinite(userProgress.hintsUsed) ? userProgress.hintsUsed : 0;
    const idx = hints.length ? hintsUsed % hints.length : 0;
    const baseHint = hints[idx];
    const contextSuffix = caseContext.subtopic ? ` (about ${caseContext.subtopic})` : '';
    return `${baseHint}${contextSuffix}`;
  }

  getMoreHints(caseContext = {}, userProgress = {}, max = 3) {
    const category = this.getCategoryFromContext(caseContext);
    const hints = this.getHintsForKey(category);
    if (!hints || hints.length === 0) return [];

    const hintsUsed = userProgress && Number.isFinite(userProgress.hintsUsed) ? userProgress.hintsUsed : 0;
    const results = [];
    const limit = Math.min(max, hints.length);
    for (let i = 0; i < limit; i += 1) {
      results.push(hints[(hintsUsed + i) % hints.length]);
    }
    return results;
  }
}

export const hintService = new HintService();
export default hintService;
