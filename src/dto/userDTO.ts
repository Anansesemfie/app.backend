export type UserType = {
  _id?: string;
  email: string;
  password: string;
  username: string;
  account: string;
  active: boolean;
  dp: string;
  bio: string;
  subscription?: string;
  createdAt?: string;
};

export type userReturn = {
  email: string;
  username: string;
  dp: string;
  bio: string;
  token: string;
  subscription: {
    active: boolean;
    id: string;
  };
};
