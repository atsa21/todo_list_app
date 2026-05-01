import { NavigationList } from "@core/models";
import { appRouts } from "./app-routes";

export const NAV_LIST: NavigationList[] = [
  { name: 'Todo list', link: `${appRouts.todo.fullPath}`, icon: 'check_circle_outline'},
  { name: 'Wish list', link: `${appRouts.wish_list.fullPath}`, icon: 'favorite_border' },
  { name: 'Profile', link: `${appRouts.profile.fullPath}`, icon: 'person_outline' }
];