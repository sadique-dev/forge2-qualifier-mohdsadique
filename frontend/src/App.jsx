import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import CardModal from "./CardModal";
import SettingsModal from "./SettingsModal";

function isOverdue(card) {
  if (!card.due_date) return false;
  const due = new Date(card.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [members, setMembers] = useState([]);
  const [tags, setTags] = useState([]);
  const [openCard, setOpenCard] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [newCardTitle, setNewCardTitle] = useState({});
  const [showNewBoardInput, setShowNewBoardInput] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const loadBoard = useCallback(async (boardId) => {
    try {
      const board = await api.getBoard(boardId);
      setActiveBoard(board);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [b, m, t] = await Promise.all([api.getBoards(), api.getMembers(), api.getTags()]);
        setBoards(b);
        setMembers(m);
        setTags(t);
        if (b.length) loadBoard(b[0].id);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [loadBoard]);

  async function handleCreateBoard() {
    if (!newBoardName.trim()) return;
    try {
      const board = await api.createBoard({ name: newBoardName.trim() });
      setBoards((prev) => [...prev, board]);
      setNewBoardName("");
      setShowNewBoardInput(false);
      loadBoard(board.id);
    } catch (e) {
      setError(e.message);
    }
  }

  async function addList() {
    if (!newListName.trim() || !activeBoard) return;
    await api.createList(activeBoard.id, { name: newListName.trim() });
    setNewListName("");
    loadBoard(activeBoard.id);
  }

  async function addCard(listId) {
    const title = (newCardTitle[listId] || "").trim();
    if (!title) return;
    await api.createCard(listId, { title });
    setNewCardTitle((prev) => ({ ...prev, [listId]: "" }));
    loadBoard(activeBoard.id);
  }

  async function moveCard(cardId, toListId) {
    await api.moveCard(cardId, toListId);
    loadBoard(activeBoard.id);
  }

  async function updateCard(cardId, data) {
    await api.updateCard(cardId, data);
    loadBoard(activeBoard.id);
  }

  async function deleteCard(cardId) {
    await api.deleteCard(cardId);
    loadBoard(activeBoard.id);
  }

  async function attachTag(cardId, tagId) {
    await api.attachTag(cardId, tagId);
    loadBoard(activeBoard.id);
  }

  async function detachTag(cardId, tagId) {
    await api.detachTag(cardId, tagId);
    loadBoard(activeBoard.id);
  }

  async function assignMember(cardId, memberId) {
    await api.assignMember(cardId, memberId);
    loadBoard(activeBoard.id);
  }

  async function unassignMember(cardId, memberId) {
    await api.unassignMember(cardId, memberId);
    loadBoard(activeBoard.id);
  }

  async function handleAddMember(name, email) {
    const newMember = await api.createMember({ name, email });
    setMembers((prev) => [...prev, newMember]);
  }

  async function handleAddTag(name, color) {
    const newTag = await api.createTag({ name, color });
    setTags((prev) => [...prev, newTag]);
  }

  function onDragStart(e, cardId) {
    e.dataTransfer.setData("cardId", cardId);
  }

  function onDrop(e, listId) {
    const cardId = e.dataTransfer.getData("cardId");
    if (cardId) moveCard(Number(cardId), listId);
  }

  const allCards = activeBoard?.lists.flatMap((list) => list.cards) || [];
  const overdueCount = allCards.filter(isOverdue).length;
  const assignedCount = allCards.filter((card) => card.members?.length > 0).length;

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">N</div>
          <div>
            <p className="eyebrow">NMG Forge</p>
            <h1 className="brand-name">Kanban Board</h1>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Your Boards</p>
          <div className="board-links" aria-label="Boards">
            {boards.map((b) => (
              <button
                key={b.id}
                className={`board-link ${activeBoard?.id === b.id ? "active" : ""}`}
                onClick={() => loadBoard(b.id)}
              >
                <span className="board-icon">📋</span>
                <span className="board-name-text">{b.name}</span>
              </button>
            ))}
          </div>
          {showNewBoardInput ? (
            <div className="new-board-row">
              <input
                className="sidebar-input"
                placeholder="Board name..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
                autoFocus
              />
              <div className="new-board-actions">
                <button className="sidebar-action-btn-sm" onClick={handleCreateBoard}>Create</button>
                <button className="sidebar-action-btn-sm cancel" onClick={() => setShowNewBoardInput(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="board-create-btn" onClick={() => setShowNewBoardInput(true)}>+ New board</button>
          )}
        </div>

        {activeBoard && (
          <div className="sidebar-section sidebar-metrics-section">
            <p className="sidebar-label">Board Overview</p>
            <div className="sidebar-metrics">
              <div className="metric-row">
                <span>Lists</span>
                <span className="metric-val">{activeBoard.lists.length}</span>
              </div>
              <div className="metric-row">
                <span>Cards</span>
                <span className="metric-val">{allCards.length}</span>
              </div>
              <div className="metric-row">
                <span>Assigned</span>
                <span className="metric-val">{assignedCount}</span>
              </div>
              <div className={`metric-row ${overdueCount > 0 ? "metric-alert" : ""}`}>
                <span>Overdue</span>
                <span className="metric-val">{overdueCount}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-info">
            <h2>{activeBoard?.name || "Select a board"}</h2>
          </div>
          <div className="topbar-actions">
            <button className="settings-btn" onClick={() => setShowSettings(true)}>
              Manage Members & Tags
            </button>
          </div>
        </header>

        {error && <div className="error-banner">{error}</div>}

        {activeBoard && (
          <main className="board">
            {activeBoard.lists.map((list) => (
              <section
                key={list.id}
                className="list"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, list.id)}
              >
                <div className="list-header">
                  <h2>{list.name}</h2>
                  <span>{list.cards.length}</span>
                </div>
                <div className="cards">
                  {list.cards.length === 0 && (
                    <div className="empty-list">Drop a card here or create the first task.</div>
                  )}
                  {list.cards.map((card) => (
                    <article
                      key={card.id}
                      className={`card ${isOverdue(card) ? "overdue" : ""}`}
                      draggable
                      onDragStart={(e) => onDragStart(e, card.id)}
                      onClick={() => setOpenCard(card)}
                    >
                      {card.tags?.length > 0 && (
                        <div className="card-tags" aria-label="Tags">
                          {card.tags.map((t) => (
                            <span key={t.id} className="mini-tag" style={{ background: t.color }} title={t.name} />
                          ))}
                        </div>
                      )}
                      <div className="card-title">{card.title}</div>
                      <div className="card-footer">
                        {card.due_date ? (
                          <span className={`card-due ${isOverdue(card) ? "overdue-text" : ""}`}>
                            {card.due_date.slice(0, 10)}
                          </span>
                        ) : (
                          <span className="card-due muted">No due date</span>
                        )}
                        {card.members?.length > 0 && (
                          <div className="card-members" aria-label="Assigned members">
                            {card.members.slice(0, 3).map((m) => (
                              <span key={m.id} className="member-avatar" title={m.name}>
                                {getInitials(m.name)}
                              </span>
                            ))}
                            {card.members.length > 3 && <span className="member-more">+{card.members.length - 3}</span>}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
                <div className="add-card-row">
                  <input
                    placeholder="New card..."
                    value={newCardTitle[list.id] || ""}
                    onChange={(e) => setNewCardTitle((p) => ({ ...p, [list.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && addCard(list.id)}
                  />
                  <button onClick={() => addCard(list.id)}>Add</button>
                </div>
              </section>
            ))}

            <div className="list new-list">
              <input
                placeholder="List name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addList()}
              />
              <button onClick={addList}>+ Add list</button>
            </div>
          </main>
        )}

        {!activeBoard && !error && (
          <main className="empty-board">
            <div className="empty-board-panel">
              <p className="eyebrow">No boards yet</p>
              <h2>Create a board to start planning.</h2>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <input
                  style={{
                    flex: 1,
                    minHeight: "36px",
                    border: "1px solid var(--line)",
                    borderRadius: "7px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    outline: "none",
                  }}
                  placeholder="Board name..."
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
                />
                <button
                  className="sidebar-btn"
                  style={{ width: "auto", minHeight: "36px", padding: "0 16px" }}
                  onClick={handleCreateBoard}
                >
                  Create
                </button>
              </div>
            </div>
          </main>
        )}
      </div>

      {openCard && (
        <CardModal
          card={activeBoard?.lists.flatMap((l) => l.cards).find((c) => c.id === openCard.id) || openCard}
          members={members}
          allTags={tags}
          onClose={() => setOpenCard(null)}
          onUpdate={updateCard}
          onDelete={deleteCard}
          onAttachTag={attachTag}
          onDetachTag={detachTag}
          onAssign={assignMember}
          onUnassign={unassignMember}
        />
      )}

      {showSettings && (
        <SettingsModal
          members={members}
          tags={tags}
          onClose={() => setShowSettings(false)}
          onAddMember={handleAddMember}
          onAddTag={handleAddTag}
        />
      )}
    </div>
  );
}
