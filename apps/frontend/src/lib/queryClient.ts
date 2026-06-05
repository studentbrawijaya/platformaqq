export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: 1,
    },
  },
};
