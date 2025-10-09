import { modules, lessons } from './seed.js';

export const getModuleList = () => {
  return modules;
};

export const getModule = (id) => {
  return modules.find(m => m.id === id);
};

export const getLesson = (id) => {
  return lessons.find(l => l.id === id);
};

export const getLessonsByModule = (moduleId) => {
  return lessons.filter(l => l.moduleId === moduleId);
};
