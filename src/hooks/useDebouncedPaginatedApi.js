import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
 
function useDebouncedPaginatedApi(apiCall, debounceDelay = 500, pageSize = 10) {
  const [queryState, setQueryState] = useState({ term: '', page: 1 });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
 
  const debounceTimeout = useRef(null);
 
  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
 
  const fetchData = useCallback(
    async (search, pageNo, append = false) => {
      try {
        if (pageNo === 1) {
          setLoading(true);
          setHasMore(true);
        } else {
          setLoadingMore(true);
        }
 
        const response = await apiCall(search, pageNo);
        const items = response?.data?.data?.[0]?.contents || [];
 
        setData(prev => (append ? [...prev, ...items] : items));
        if (items.length < pageSize) setHasMore(false);
      } catch (error) {
        console.error('API error:', error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [apiCall, pageSize]
  );
 
  // Run API when queryState changes
  useEffect(() => {
    fetchData(queryState.term, queryState.page, queryState.page > 1);
  }, [queryState.term, queryState.page, fetchData]);
 
  // Debounced search setter
  const search = useCallback(term => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setQueryState({ term, page: 1 });
    }, debounceDelay);
  }, [debounceDelay]);
 
  // Pagination trigger
  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      setQueryState(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [loading, loadingMore, hasMore]);
 
  // Stable returned object to avoid unnecessary re-renders
  return useMemo(() => ({
    data,
    loading,
    loadingMore,
    hasMore,
    searchTerm: queryState.term,
    search,
    loadMore,
  }), [data, loading, loadingMore, hasMore, queryState.term, search, loadMore]);
}
 
export default useDebouncedPaginatedApi;
 