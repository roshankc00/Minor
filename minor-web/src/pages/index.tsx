import React from 'react';
import Head from 'next/head';
import ChatInterface from '@/components/ChatInterface';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Health Assistant AI</title>
        <meta name="description" content="AI-powered health consultation chatbot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ChatInterface />
      </main>
    </div>
  );
};

export default Home;
