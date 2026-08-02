export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-bold text-white">
          AFRICANA
        </h2>

        <p className="mt-4">
          Africa's trusted source for news, business, technology, sports,
          entertainment, and culture.
        </p>

        <p className="mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Africana. All rights reserved.
        </p>
      </div>
    </footer>
  );
}