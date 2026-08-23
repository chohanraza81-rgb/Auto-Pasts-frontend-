export default function AuthorBox() {
  return (
    <div className="flex items-center gap-4 my-6 p-4 bg-gray-50 rounded-lg">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-xl">🔧</div>
      <div>
        <p className="font-semibold">By Mike Johnson</p>
        <p className="text-sm text-gray-600">20 years experience · ASE Certified · 10,000+ brake pads installed</p>
      </div>
    </div>
  );
}
