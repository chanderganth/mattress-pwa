export default function PriceDisplay({ total }) {
  return (
    <div className="p-4 bg-white border rounded shadow-sm">
      <div className="text-lg font-semibold">Live Price</div>
      <div className="text-2xl text-brand">₹ {Number(total).toFixed(2)}</div>
    </div>
  );
}
