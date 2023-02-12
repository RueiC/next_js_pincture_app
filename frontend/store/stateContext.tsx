import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PinItem, SessionUser, SubmitState, PinDetail } from '../types';
import usePinsData from '../hooks/usePinsData';

interface defaultValue {
  isLoading: boolean;
  toggleDeleteWindow: boolean;
  setToggleDeleteWindow: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  savePin: (
    // eslint-disable-next-line no-unused-vars
    pinItem: PinItem | PinDetail,
    // eslint-disable-next-line no-unused-vars
    session: SessionUser,
    // eslint-disable-next-line no-unused-vars
    setSubmitState: React.Dispatch<React.SetStateAction<SubmitState>>,
  ) => Promise<any | null>;
  unSavePin: (
    // eslint-disable-next-line no-unused-vars
    pinItem: PinItem,
    // eslint-disable-next-line no-unused-vars
    session: SessionUser,
    // eslint-disable-next-line no-unused-vars
    setSubmitState: React.Dispatch<React.SetStateAction<SubmitState>>,
  ) => Promise<any | null>;
}

const Context = createContext({} as defaultValue);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    comments,
    toggleDeleteWindow,
    deletedItem,
    savePin,
    unSavePin,
    toggleSavedBtn,
    fetchComments,
    addComment,
    setDeletedItem,
    setToggleDeleteWindow,
  } = usePinsData();

  // 狀態 (pin, input, modal) v
  // set pin v
  // set comment v
  // type

  return (
    <Context.Provider
      value={{
        comments,
        isLoading,
        toggleDeleteWindow,
        deletedItem,
        savePin,
        unSavePin,
        setIsLoading,
        setDeletedItem,
        fetchComments,
        addComment,
        toggleSavedBtn,
        setToggleDeleteWindow,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
