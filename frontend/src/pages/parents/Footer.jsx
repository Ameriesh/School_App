export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 mt-12 text-sm text-gray-600">
      &copy; {new Date().getFullYear()} SchoolApp. Tous droits réservés.
    </footer>
  );
}