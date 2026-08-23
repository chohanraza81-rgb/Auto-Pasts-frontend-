export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2">Have a question? Drop me a line.</p>
      <form className="mt-6 space-y-4">
        <input type="text" placeholder="Name" className="w-full border p-2 rounded" />
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <textarea placeholder="Message" className="w-full border p-2 rounded" rows={4} />
        <button className="bg-primary text-white px-6 py-2 rounded">Send</button>
      </form>
    </main>
  );
}
