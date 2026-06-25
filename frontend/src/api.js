const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 
      "Content-Type": "application/json", 
      Accept: "application/json",
      "Bypass-Tunnel-Reminder": "true"
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Boards
  getBoards: () => request("/boards"),
  getBoard: (id) => request(`/boards/${id}`),
  createBoard: (data) => request("/boards", { method: "POST", body: JSON.stringify(data) }),

  // Lists
  createList: (boardId, data) =>
    request(`/boards/${boardId}/lists`, { method: "POST", body: JSON.stringify(data) }),
  updateList: (id, data) => request(`/lists/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteList: (id) => request(`/lists/${id}`, { method: "DELETE" }),

  // Cards
  createCard: (listId, data) =>
    request(`/lists/${listId}/cards`, { method: "POST", body: JSON.stringify(data) }),
  updateCard: (id, data) => request(`/cards/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  moveCard: (id, listId) =>
    request(`/cards/${id}/move`, { method: "PATCH", body: JSON.stringify({ list_id: listId }) }),
  deleteCard: (id) => request(`/cards/${id}`, { method: "DELETE" }),

  // Tags
  getTags: () => request("/tags"),
  createTag: (data) => request("/tags", { method: "POST", body: JSON.stringify(data) }),
  attachTag: (cardId, tagId) =>
    request(`/cards/${cardId}/tags`, { method: "POST", body: JSON.stringify({ tag_id: tagId }) }),
  detachTag: (cardId, tagId) => request(`/cards/${cardId}/tags/${tagId}`, { method: "DELETE" }),

  // Members
  getMembers: () => request("/members"),
  createMember: (data) => request("/members", { method: "POST", body: JSON.stringify(data) }),
  assignMember: (cardId, memberId) =>
    request(`/cards/${cardId}/members`, { method: "POST", body: JSON.stringify({ member_id: memberId }) }),
  unassignMember: (cardId, memberId) =>
    request(`/cards/${cardId}/members/${memberId}`, { method: "DELETE" }),

  // Comments & Activities
  getActivities: (cardId) => request(`/cards/${cardId}/activities`),
  postComment: (cardId, memberId, content) =>
    request(`/cards/${cardId}/comments`, { method: "POST", body: JSON.stringify({ member_id: memberId, content }) }),
};
