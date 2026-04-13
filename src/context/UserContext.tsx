import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserState {
  fullName: string;
  firstName: string;
  profileImage: string | null; // local URI from image picker
}

interface UserContextType {
  user: UserState;
  setFullName: (name: string) => void;
  setProfileImage: (uri: string | null) => void;
  logout: () => void;
}

const defaultUser: UserState = {
  fullName: 'Alex Wu',
  firstName: 'Alex',
  profileImage: null,
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setFullName: () => {},
  setProfileImage: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(defaultUser);

  const setFullName = (name: string) => {
    const first = name.split(' ')[0] || name;
    setUser(prev => ({ ...prev, fullName: name, firstName: first }));
  };

  const setProfileImage = (uri: string | null) => {
    setUser(prev => ({ ...prev, profileImage: uri }));
  };

  const logout = () => {
    setUser(defaultUser);
  };

  return (
    <UserContext.Provider value={{ user, setFullName, setProfileImage, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
