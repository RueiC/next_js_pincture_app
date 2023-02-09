import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { PinItem, SessionUser, SubmitState, PinDetail } from '../types';
import { client } from '../utils/client';

interface defaultValue {
  isLoading: boolean;
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

  const savePin = async (
    pinItem: PinItem | PinDetail,
    session: SessionUser,
    setSubmitState: React.Dispatch<React.SetStateAction<SubmitState>>,
  ): Promise<any | null> => {
    if (pinItem === null || !session) {
      return null;
    }

    setSubmitState({
      style: 'bg-gray-300',
      text: '處理中',
      state: 'uploading',
    });

    await client
      .patch(pinItem._id)
      .setIfMissing({ save: [] })
      .append('save', [
        {
          _key: uuidv4(),
          userId: session.id,
        },
      ])
      .commit();

    setSubmitState({
      style: 'bg-red-500',
      text: '已儲存',
      state: 'saved',
    });

    toast('儲存成功', { type: 'success' });

    return {
      ...pinItem,
      save: [
        {
          _key: uuidv4(),
          userId: session.id!,
        },
      ],
    };
  };

  const unSavePin = async (
    pinItem: PinItem | PinDetail,
    session: SessionUser,
    setSubmitState: React.Dispatch<React.SetStateAction<SubmitState>>,
  ): Promise<any | null> => {
    if (
      pinItem === null ||
      !session ||
      !pinItem?.save ||
      pinItem?.save === null
    ) {
      return null;
    }

    setSubmitState({
      style: 'bg-gray-300',
      text: '處理中',
      state: 'uploading',
    });

    const reviewsToRemove = [`save[userId=="${session.id}"]`];
    await client.patch(pinItem._id).unset(reviewsToRemove).commit();

    const newSave = pinItem!.save!.filter((item) => {
      return item.userId !== session.id;
    });

    setSubmitState({
      style: 'bg-red-500',
      text: '儲存',
      state: 'unSaved',
    });

    toast('已取消儲存', { type: 'success' });

    return {
      ...pinItem,
      save: newSave,
    };
  };

  return (
    <Context.Provider
      value={{
        isLoading,
        savePin,
        unSavePin,
        setIsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
