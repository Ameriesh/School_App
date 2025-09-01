const API_URL = "http://localhost:5000/api/eleves";

export async function fetchEleves(token) {
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des élèves");
  return res.json();
} 