import {
  mapSearchDocToSummary,
  mapSubjectWorkToSummary,
  mapWorkJsonToDetails,
  workKeyToId,
} from '@/entities/book/api/mappers';

describe('book mappers', () => {
  it('parses work keys', () => {
    expect(workKeyToId('/works/OL45883W')).toBe('OL45883W');
    expect(workKeyToId(undefined)).toBeNull();
  });

  it('maps search docs', () => {
    const book = mapSearchDocToSummary({
      key: '/works/OL1W',
      title: 'Hello',
      author_name: ['A'],
      first_publish_year: 2001,
      cover_i: 123,
      subject: ['Fiction'],
    });
    expect(book?.id).toBe('OL1W');
    expect(book?.title).toBe('Hello');
    expect(book?.coverUrl).toContain('covers.openlibrary.org');
  });

  it('maps subject works', () => {
    const book = mapSubjectWorkToSummary({
      key: '/works/OL2W',
      title: 'World',
      cover_edition_key: 'OL999M',
      authors: [{ name: 'B' }],
    });
    expect(book?.authors).toEqual(['B']);
  });

  it('maps work json to details', () => {
    const details = mapWorkJsonToDetails(
      'OL3W',
      {
        title: 'Details',
        description: { value: 'Nice book' },
        subjects: ['Sci-fi'],
        covers: [44],
      },
      ['Author'],
    );
    expect(details.title).toBe('Details');
    expect(details.description).toBe('Nice book');
    expect(details.subjects).toContain('Sci-fi');
    expect(details.authors).toEqual(['Author']);
  });
});
