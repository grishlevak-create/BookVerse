export type BookSummary = {
  /** Work id without `/works/` prefix, e.g. `OL45883W`. */
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  firstPublishYear?: number;
  subjects?: string[];
};

export type BookDetails = BookSummary & {
  description: string | null;
  subjects: string[];
  publishDate?: string;
};

export type BookReviewRow = {
  id: string;
  bookId: string;
  userId: string;
  text: string;
  rating: number;
  createdAt: string;
  username?: string | null;
  avatarUrl?: string | null;
};
