import { Category } from '@core/models/category.model';

export const TODO_CATEGORIES: Category[] = [
  { id: 'work', name: 'work', icon: 'fa-briefcase', isHidden: false, isInitial: true },
  { id: 'personal', name: 'personal', icon: 'fa-user', isHidden: false, isInitial: true },
  { id: 'health', name: 'health', icon: 'fa-heart', isHidden: false, isInitial: true },
];
