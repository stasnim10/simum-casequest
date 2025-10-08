function adaptiveSelector(context = {}) {
  return { lessonId: 'intro-lesson', reason: 'fallback' };
}
export function selectNextLesson(context = {}) { return adaptiveSelector(context); }
export function chooseNextLesson(context = {}) { return adaptiveSelector(context); }
export function pickNextLesson(context = {}) { return adaptiveSelector(context); }
export default adaptiveSelector;
export { adaptiveSelector };
