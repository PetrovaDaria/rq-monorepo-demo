import React from 'react';
import { createRoot } from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // чтобы при переключении с девтулзов/вкладок на приложение не происходил перезапрос
      // если включить, будет очень сильно сбивать с толку
      refetchOnWindowFocus: false,
      // задавайте ретраи самостоятельно отдельно для каждого query
      retry: false,
    },
  },
});


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools/>
      first app
    </QueryClientProvider>
  )
}

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
}