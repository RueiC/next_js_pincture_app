import { Dispatch, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import type {
  PinItem,
  SessionUser,
  CommentType,
  SubmitState,
  DeletedItem,
  SubmitedComment,
} from '../types';
import { client } from '../utils/client';
import { pinComments } from '../utils/queries';
import { stateMsgTemplate } from '../utils/data';

const usePinsData = () => {
  const [toggleDeleteWindow, setToggleDeleteWindow] = useState<boolean>(false);
  const [deletedItem, setDeletedItem] = useState<DeletedItem | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);

  const savePin = async (
    pinItem: PinItem,
    session: SessionUser,
  ): Promise<PinItem | null> => {
    if (pinItem === null || !session) {
      return null;
    }

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
    pinItem: PinItem,
    session: SessionUser,
  ): Promise<PinItem | null> => {
    if (
      pinItem === null ||
      !session ||
      !pinItem?.save ||
      pinItem?.save === null
    ) {
      return null;
    }

    const reviewsToRemove = [`save[userId=="${session.id}"]`];
    await client.patch(pinItem._id).unset(reviewsToRemove).commit();

    const newSave = pinItem!.save!.filter((item) => {
      return item.userId !== session.id;
    });

    toast('已取消儲存', { type: 'success' });

    return {
      ...pinItem,
      save: newSave,
    };
  };

  const toggleSavedBtn = async (
    pinItem: PinItem,
    isSaved: boolean,
    session: SessionUser,
    setPinItem: Dispatch<React.SetStateAction<PinItem | null>>,
    setSubmitState: Dispatch<React.SetStateAction<SubmitState>>,
  ): Promise<void> => {
    if (!pinItem || !session) return;
    setSubmitState({
      style: stateMsgTemplate.style.gray,
      text: stateMsgTemplate.text.handling,
      state: stateMsgTemplate.state.handling,
    });

    try {
      if (isSaved) {
        const res = await unSavePin(pinItem, session);
        setPinItem(res);
      } else {
        const res = await savePin(pinItem, session);
        setPinItem(res);
      }
    } catch (err) {
      console.log(err);
    }

    setSubmitState({
      style: stateMsgTemplate.style.red,
      text: stateMsgTemplate.text.default,
      state: stateMsgTemplate.state.default,
    });
  };

  const fetchComments = async (pinId: string): Promise<void> => {
    try {
      const query: string = pinComments(pinId);
      const res = await client.fetch(query);
      const newComments = res[0].comments;

      setComments(newComments);
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async (
    pinId: string,
    commentData: SubmitedComment,
  ): Promise<void> => {
    try {
      await client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .append('comments', [commentData])
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {
          fetchComments(pinId);
          toast('已新增留言', { type: 'success' });
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!deletedItem) {
      setToggleDeleteWindow(false);
      return;
    }

    setToggleDeleteWindow(true);
  }, [deletedItem]);

  return {
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
  };
};

export default usePinsData;
