import type { AppProps } from 'next/app';
import '@/styles/main.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const App = ({ Component, pageProps }: AppProps) => {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default App;
