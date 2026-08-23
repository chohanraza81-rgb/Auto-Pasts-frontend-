import AuthorBox from '@/components/AuthorBox';

export default function AboutMikePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">About Mike</h1>
      <div className="mt-6">
        <AuthorBox />
        <p className="mt-4">Mike Johnson has been fixing cars in Toronto for 20 years. He's installed over 10,000 brake pads and knows every trick in the book. When he's not in the garage, he's writing about cars to help Canadians save money.</p>
      </div>
    </main>
  );
}
