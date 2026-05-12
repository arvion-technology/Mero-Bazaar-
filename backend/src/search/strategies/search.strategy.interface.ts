export interface SearchStrategy<TFilters = any, TResult = any> {
  search(filters: TFilters): Promise<TResult>;
}