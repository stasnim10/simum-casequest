import { modules, lessons } from './seed.js';
import { cases } from './cases.js';
import { getSimulatorCases, getSimulatorCaseBySlug } from './simulatorCases.js';

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

export const getCaseById = (id) => {
  return cases.find(c => c.id === id);
};

export const getAllCases = () => {
  return cases;
};

export const getAllSimulatorCases = () => {
  return getSimulatorCases();
};

export const getSimulatorCase = (slug) => {
  return getSimulatorCaseBySlug(slug);
};
