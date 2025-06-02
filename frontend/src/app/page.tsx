import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Head>
        <title>Mon App Next.js</title>
        <meta name="description" content="Mon App Next.js avec Tailwind CSS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-primary">Bienvenue sur mon App Next.js</h1>
        <p className="text-secondary">Ceci est un paragraphe avec la couleur secondaire.</p>
        <button className="bg-cta text-noir px-4 py-2 rounded">Cliquez ici</button>
      </main>
    </div>
  );
}
