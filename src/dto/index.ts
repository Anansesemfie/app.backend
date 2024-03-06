export type sessionsDTO = {
  _id?: string;
  user?: string;
  duration?: number;
  expiredAt?: Date;
  external?: boolean;
  moment?: Date;
};

export type bookDTO = {
  _id?: string;
  title: string;
  description: string;
  status: string;
  snippet?: string;
  authors?: string[];
  category: string[];
  languages: string[];
  folder: string;
  cover: string;
  collections: string[];
  owner: string;
  uploader: string;
  moment?: Date;
  meta?: {
    played: number;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  };
};

export type chapterDTO = {
  _id?: string;
  title: string;
  description: string;
  file: string;
  mimetype: string;
  book: string;
  moment?: Date;
};
