import { PinDetail } from "../types";

export const searchQuery = (searchTerm: string): string => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
        image{
          asset->{
            url
          }
        },
            _id,
            userId,
            destination,
            postedBy->{
              _id,
              userName,
              image
            },
            save[]{
              _key,
              userId
            },
          }`;
  return query;
};

export const feedQuery: string = `*[_type == "pin"] | order(_createdAt desc) {
  image{
    asset->{
      url
    }
  },
      _id,
      userId,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        _key,
        userId
      },
  } `;

export const pinDetailQuery = (pinId: string): string => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    userId,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
   save[]{
      _key,
      userId
    },
  }`;
  return query;
};

export const pinComments = (pinId: string): string => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    comments[]{
      _key,
      comment,
      createdAt,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const pinDetailMorePinQuery = (pin: PinDetail): string => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    userId,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      userId
    },
  }`;
  return query;
};

export const userQuery = (userId: string): string => {
  const query = `*[_type == "user" && _id == '${userId}']`;
  return query;
};

export const userCreatedPinsQuery = (userId: string): string => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    userId,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      userId
    },
  }`;
  return query;
};

export const userSavedPinsQuery = (userId: string): string => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    userId,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      userId
    },
  }`;
  return query;
};

export const categoryQuery = (categoryId: string): string => {
  const query = `*[_type == "pin" && category == '${categoryId}']{
  image{
    asset->{
      url
    }
  },
  _id,
  userId,
  destination,
  postedBy->{
    _id,
    userName,
    image
  },
  save[]{
    _key,
    userId
  },
}`;
  return query;
};
