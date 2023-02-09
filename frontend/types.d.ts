import { Session } from "next-auth/core/types";

type Image = {
  asset: {
    url: string;
  };
};

type PostedBy = {
  _id: string;
  userName: string;
  image: string;
};

export type CommentType = {
  _key: string;
  comment: string;
  createdAt: string;
  postedBy: PostedBy;
};

export type Save = {
  userId: string;
  _key: string;
};

export type User = {
  image: string;
  userName: string;
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
};

export type PageId = string | string[] | undefined;

export type FileUploadMessage = {
  style: string;
  message: string;
};

export type SubmitState = {
  style: string;
  text: string;
  state: string;
};

export interface SessionUser extends Session {
  id?: string;
}

export interface Redirect {
  redirect: {
    destination: string;
  };
  props: {};
}

export interface PinItem {
  _id: string;
  destination: string;
  image: Image;
  postedBy: PostedBy;
  save: Save[] | null;
  userId: string;
}

export interface PinDetail extends PinItem {
  title: string;
  about: string;
  category: string;
}
