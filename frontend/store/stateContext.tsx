/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from 'react';
import usePinsData from '../hooks/usePinsData';
import type {
  PinItem,
  CommentType,
  DeletedItem,
  SessionUser,
  SubmitState,
  SubmitedComment,
} from '../types';

interface pinsDataHook {
  comments: CommentType[];
  isLoading: boolean;
  toggleDeleteWindow: boolean;
  deletedItem: DeletedItem | null;
  savePin: (pinItem: PinItem, session: SessionUser) => Promise<PinItem | null>;
  unSavePin: (
    pinItem: PinItem,
    session: SessionUser,
  ) => Promise<PinItem | null>;
  toggleSavedBtn: (
    pinItem: PinItem,
    isSaved: boolean,
    session: SessionUser,
    setPinItem: Dispatch<React.SetStateAction<PinItem | null>>,
    setSubmitState: Dispatch<React.SetStateAction<SubmitState>>,
  ) => Promise<void>;
  fetchComments: (pinId: string) => Promise<void>;
  addComment: (pinId: string, commentData: SubmitedComment) => Promise<void>;
  setDeletedItem: Dispatch<SetStateAction<DeletedItem | null>>;
  setToggleDeleteWindow: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<React.SetStateAction<boolean>>;
}

const Context = createContext({} as pinsDataHook);

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

  return (
    <Context.Provider
      value={{
        comments,
        isLoading,
        toggleDeleteWindow,
        deletedItem,
        savePin,
        unSavePin,
        toggleSavedBtn,
        fetchComments,
        addComment,
        setDeletedItem,
        setToggleDeleteWindow,
        setIsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
