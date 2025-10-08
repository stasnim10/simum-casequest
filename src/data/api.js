import { modules, lessons } from './seed';

export function getModuleList() {
  return modules;
}

export function getModule(id) {
  return modules.find((m) => m.id === id);
}

export function getLesson(id) {
  return lessons.find((l) => l.id === id);
}

export function getLessonsByModule(moduleId) {
  return lessons.filter((l) => l.moduleId === moduleId);
}
