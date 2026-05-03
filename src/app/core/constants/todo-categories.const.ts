import { Category } from '@core/models/category.model';

export const TODO_CATEGORIES: Category[] = [
  { id: 'work',    name: 'work',    icon: 'fa-briefcase', isHidden: false, isInitial: true },
  { id: 'study',   name: 'study',   icon: 'fa-book',      isHidden: false, isInitial: true },
  { id: 'home',    name: 'home',    icon: 'fa-house',     isHidden: false, isInitial: true },
  { id: 'hobbies', name: 'hobbies', icon: 'fa-palette',   isHidden: false, isInitial: true },
  { id: 'other',   name: 'other',   icon: 'fa-tag',       isHidden: false, isInitial: true },
];
