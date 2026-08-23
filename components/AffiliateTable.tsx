interface AffiliateTableProps {
  products: {
    name: string;
    price: number;
    rating: number;
    link: string;
  }[];
}

export default function AffiliateTable({ products }: AffiliateTableProps) {
  if (!products || products.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">Price (CAD)</th>
            <th className="p-2 text-left">Rating</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.rating}/5</td>
              <td className="p-2"><a href={p.link} className="text-primary">Buy</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
