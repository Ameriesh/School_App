const API_URL = 'http://localhost:5000/api/absences';

export async function fetchAbsences(token, filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_URL}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des absences');
  return res.json();
}

export async function addAbsence(token, data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de l\'ajout de l\'absence');
  return res.json();
}

export async function updateAbsence(token, id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de la modification de l\'absence');
  return res.json();
}

export async function deleteAbsence(token, id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression de l\'absence');
  return res.json();
}

export async function fetchAllAbsences(token) {
  const res = await fetch(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur lors du chargement de toutes les absences');
  return res.json();
}

export async function fetchAbsencesForParent(token, enfantId) {
  const res = await fetch(`${API_URL}/parent/${enfantId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des absences de l\'enfant');
  return res.json();
} 