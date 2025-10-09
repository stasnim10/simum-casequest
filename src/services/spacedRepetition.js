import remoteConfig from './remoteConfig';

// Simplified SM-2 inspired spaced repetition algorithm
export class SpacedRepetitionService {
  constructor() {
    this.minInterval = 1;
    this.maxInterval = 365;
  }

  // Map 4-level UI to SM-2 quality (0-5 scale)
  mapUIToSM2Quality(uiRating) {
    const mapping = {
      0: 1, // didn't know
      1: 2, // hard  
      2: 4, // good
      3: 5  // easy
    };
    return mapping[uiRating] || 1;
  }

  calculateNextReview(item, uiPerformance) {
    const config = remoteConfig.getSM2Config();
    const quality = this.mapUIToSM2Quality(uiPerformance);
    
    const { 
      sr = {
        ef: config.initialEase,
        reps: 0,
        intervalDays: config.firstInterval
      }
    } = item;

    let newEF = sr.ef;
    let newReps = sr.reps;
    let newInterval = sr.intervalDays;

    if (quality < 3) {
      newReps = 0;
      newInterval = 1;
    } else {
      newReps += 1;
      if (newReps === 1) {
        newInterval = config.firstInterval;
      } else if (newReps === 2) {
        newInterval = config.secondInterval;
      } else {
        newInterval = Math.round(sr.intervalDays * newEF);
      }
      
      newEF = Math.max(1.3, sr.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    }

    newInterval = Math.max(this.minInterval, Math.min(this.maxInterval, newInterval));
    const dueAt = Date.now() + (newInterval * 24 * 60 * 60 * 1000);

    return {
      ...item,
      sr: {
        ef: newEF,
        reps: newReps,
        intervalDays: newInterval,
        dueAt,
        history: [...(sr.history || []), { quality, date: Date.now() }]
      },
      strength: this.calculateStrength(newInterval, newEF)
    };
  }

  calculateStrength(interval, easeFactor) {
    const normalizedInterval = Math.min(interval / 30, 1);
    const normalizedEase = Math.min((easeFactor - 1.3) / (3 - 1.3), 1);
    return Math.round((normalizedInterval * 0.7 + normalizedEase * 0.3) * 100);
  }

  getDueItems(items) {
    const now = Date.now();
    return items.filter(item => 
      !item.sr?.dueAt || item.sr.dueAt <= now
    ).sort((a, b) => this.getUrgency(b, now) - this.getUrgency(a, now));
  }

  getUrgency(item, now = Date.now()) {
    const { sr = {}, strength = 0 } = item;
    const overdueDays = Math.max(0, (now - (sr.dueAt || now)) / (1000 * 60 * 60 * 24));
    const weakness = 100 - strength;
    return overdueDays * 2 + weakness * 0.5;
  }

  generateReviewSession(items) {
    const batchSize = remoteConfig.getReviewBatchSize();
    const dueItems = this.getDueItems(items);
    const sessionItems = dueItems.slice(0, batchSize);
    
    return {
      items: sessionItems,
      estimatedTime: sessionItems.length,
      totalDue: dueItems.length,
      priority: sessionItems.length > 5 ? 'high' : sessionItems.length > 0 ? 'medium' : 'none'
    };
  }

  createReviewItem(concept) {
    const config = remoteConfig.getSM2Config();
    return {
      id: concept.id,
      name: concept.name,
      type: concept.type || 'concept',
      content: concept.content,
      question: concept.question,
      answer: concept.answer,
      sr: {
        ef: config.initialEase,
        reps: 0,
        intervalDays: config.firstInterval,
        dueAt: Date.now(),
        history: []
      },
      strength: 0,
      createdAt: Date.now()
    };
  }
}

export default new SpacedRepetitionService();
