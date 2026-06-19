export type ApiResponse<T> = {
  data: T;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type ApiErrorResponse = {
  code: string;
  message: string;
  status: number;
};

export type SessionType = {
  _id?: string;
  user?: string;
  duration?: string;
  expiredAt: string;
  external?: boolean;
  createdAt?: string;
};

export type BookType = {
  _id?: string;
  title: string;
  description: string;
  status: number;
  snippet?: string;
  authors: string[];
  narrators: string[];
  category: string[];
  genres: string[];
  languages: string[];
  folder: string;
  cover: string;
  collections: string[];
  associates: string[];
  uploader: string;
  organization?: string;
  edition?: string;
  publishedYear?: number;
  duration?: string;
  createdAt?: Date;
  meta: {
    played: number;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  };
};

export type BookResponseType = {
  id: string;
  title: string;
  description: string;
  snippet?: string;
  authors: AuthorResponseType[];
  narrators: NarratorResponseType[];
  category: string[];
  genres: string[];
  languages: string[];
  cover: string;
  edition?: string;
  publishedYear?: number;
  duration?: string;
  associates?: string[];
  organization?: string;
  meta: {
    played: number;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  };
};

export type BookUpdateType = BookType & {
  owner?: string;
  uploader?: string;
  title?: string;
  description?: string;
  status?: number;
  category?: string[];
  genres?: string[];
  languages?: string[];
  authors?: string[];
  narrators?: string[];
  associates?: string[];
  folder?: string;
  cover?: string;
  edition?: string;
  publishedYear?: number;
  duration?: string;
  meta?: {
    played?: number;
    views?: number;
    likes?: number;
    dislikes?: number;
    comments?: number;
  };
};

export type ChapterType = {
  _id?: string;
  title: string;
  description: string;
  file: string;
  mimetype: string;
  password: string;
  book: string;
  order?: number;
  createdAt?: Date;
};

export type ChapterResponseType = {
  id: string;
  title: string;
  description: string;
  content?: string; //TODO:Remove this line
  book: BookResponseType;
  password: string;
  order: number;
  createdAt: string | Date;
  type: "audio" | "ebook";
};
export type SeenType = {
  _id?: string;
  period?: string;
  user: string;
  bookID: string;
  seenAt?: Date;
  playedAt?: (string | Date)[];
  createdAt?: string;
};

export type subscriberDTO = {
  _id?: string;
  parent: string;
  user: string;
  active: boolean;
  books?: string[];
  ref: string;
  createdAt?: string;
  updatedAt?: string;
  activatedAt?: string;
  deactivatedAt?: string;
};

export type SubscriptionsType = {
  _id?: string;
  name: string;
  active: boolean;
  visible: boolean;
  duration: string;
  users: number;
  autorenew: boolean;
  amount: number;
  books?: string[];
  origin?: string;
  accent: string;
  createdAt?: string;
};
export type SubscriptionsResponse = {
  id: string;
  name: string;
  active: boolean;
  visible: boolean;
  duration: string;
  users: number;
  autorenew: boolean;
  amount: number;
  books?: string[];
  origin?: string;
  accent: string;
  createdAt: string;
};

export type AdminSubscriberRecord = {
  id: string;
  user: {
    username: string;
    email: string;
    dp: string;
  };
  plan: string;           // plan name from parent Subscription
  autorenew: boolean;     // parent plan's autorenew flag
  activatedAt: Date | null;
  expiresAt: Date | null;        // activatedAt + plan.duration ms; null if never activated
  daysRemaining: number | null;  // signed integer; negative = already expired; null if never activated
};

export type UserType = {
  _id?: string;
  email: string;
  password: string;
  username: string;
  account: number;
  active: boolean;
  dp: string;
  bio: string;
  /** E.164 phone number used for WhatsApp notifications, e.g. "+233241234567" */
  whatsappNumber?: string;
  organization?: string;
  subscription?: string;
  createdAt?: string;
  key?: string;
};

export type UserResponse = {
  id: string;
  email: string;
  username: string;
  account: number;
  active: boolean;
  dp: string;
  bio: string;
  /** E.164 phone number used for WhatsApp notifications */
  whatsappNumber?: string;
  subscription?: string;
  createdAt: string;
};

export type ReactionType = {
  _id?: string;
  bookID: string;
  user: string;
  action: "Liked" | "Disliked";
  period?: string;
  createdAt?: string;
  deletedAt?: string;
};

export type CommentType = {
  _id?: string;
  bookID: string;
  user: string | UserType;
  comment: string;
  period: string;
  parentId?: string | null;
  createdAt?: Date | string;
  deletedAt?: Date | string | null;
};
export type CommentResponse = {
  id: string;
  user: {
    id: string;
    name: string;
    picture: string;
    email: string;
  };
  comment: string;
  createdAt?: string;
  replies?: CommentResponse[];
};

export type ReportType = {
  _id?: string;
  commentID: string;
  reporter: string;
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt?: Date;
};

export type ReportResponseType = {
  id: string;
  comment: {
    id: string;
    text: string;
  };
  reporter: {
    id: string;
    username: string;
  };
  reason: string;
  status: string;
  createdAt: string;
};

export type PaginatedCommentsResponse = {
  page: number;
  limit: number;
  total: number;
  results: CommentResponse[];
};

export type CategoryType = {
  _id?: string;
  title: string;
  description?: string;
  createdAt?: string;
};
export type CategoryResponseType = {
  id: string;
  name: string;
};

export type GenreType = {
  _id?: string;
  title: string;
  active?: boolean;
  createdAt?: string;
};

export type GenreResponseType = {
  id: string;
  name: string;
  active: boolean;
};

export type LanguageType = {
  _id?: string;
  title: string;
  active: boolean;
  createdAt?: string;
};

export type LanguageResponseType = {
  id: string;
  name: string;
};
export type OrganizationType = {
  _id?: string;
  name: string;
  description?: string;
  type: string;
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type OrganizationResponseType = {
  id: string;
  name: string;
  description?: string;
  type: string;
  logo?: string;
};
export type PeriodType = {
  _id?: string;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  year: number;
  month: number;
  active: boolean;
};
export type PeriodResponseType = {
  id: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  year: number;
  month: number;
  status: "active" | "inactive";
};

export type AppConfigType = {
  _id?: string;
  autoPeriodCreation: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AppConfigResponseType = {
  id: string;
  autoPeriodCreation: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type OriginCurrencyType = {
  name?: string;
  symbol?: string;
};

export type OriginType = {
  _id?: string;
  name: string;
  flag: string;
  currency?: OriginCurrencyType;
  active?: boolean;
  createdAt?: string;
};

export type QuoteType = {
  _id?: string;
  quote: string;
  author: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type QuoteResponseType = {
  id: string;
  quote: string;
  author: string;
  active: boolean;
  createdAt: string;
};

export type AuthorType = {
  _id?: string;
  name: string;
  bio?: string;
  active?: boolean;
  createdAt?: string;
};

export type AuthorResponseType = {
  id: string;
  name: string;
  bio?: string;
  active: boolean;
};

export type NarratorType = {
  _id?: string;
  name: string;
  bio?: string;
  active?: boolean;
  createdAt?: string;
};

export type NarratorResponseType = {
  id: string;
  name: string;
  bio?: string;
  active: boolean;
};

