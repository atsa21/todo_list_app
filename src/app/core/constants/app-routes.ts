type AuthRoutingPath = 'login' | 'sign_up';

type MainRoutingPath = 'main' | 'todo' | 'wish_list' | 'profile';

export type AppRoutingType = AuthRoutingPath | MainRoutingPath;

export const appRouts: Record<
AppRoutingType,
  {
    routerPath: string;
  }
> = {
  login: { routerPath: 'login' },
  sign_up: { routerPath: 'sign_up' },
  main: { routerPath: 'main' },
  todo: { routerPath: 'todo' },
  wish_list: { routerPath:'wish_list' },
  profile: { routerPath:'profile' },
}
