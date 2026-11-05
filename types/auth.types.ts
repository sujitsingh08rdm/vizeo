export interface UserInterface {
  id: string;
  mobile: string;
  fullname: string;
  email: string;
}

export interface AuthContextInterface {
  user: UserInterface | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: UserInterface | null) => void;
  login: () => void;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}
