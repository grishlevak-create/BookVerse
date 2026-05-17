import type { BookSortOption } from '@/entities/book/api/searchBooks';

export const BOOK_SORT_OPTIONS: { value: BookSortOption; label: string }[] = [
  { value: 'relevance', label: 'Релевантность' },
  { value: 'rating', label: 'Рейтинг' },
  { value: 'new', label: 'Сначала новые' },
  { value: 'old', label: 'Сначала старые' },
];

export const SUBJECT_FILTER_OPTIONS = [
  { value: 'fiction', label: 'Fiction' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'science_fiction', label: 'Science Fiction' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'romance', label: 'Romance' },
  { value: 'history', label: 'History' },
] as const;
