import './NoteCard.css'

export default function NoteCard({ note, onEdit, onDelete, onPin, onFavorite }) {
  return (
    <div className="note-card">
      <div className="note-header">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <button
            className={`btn-icon ${note.isPinned ? 'pinned' : ''}`}
            onClick={() => onPin(note._id)}
            title="Pin note"
          >
            📌
          </button>
          <button
            className={`btn-icon ${note.isFavorite ? 'favorited' : ''}`}
            onClick={() => onFavorite(note._id)}
            title="Mark as favorite"
          >
            ❤️
          </button>
        </div>
      </div>

      <div className="note-subject">
        <span
          className="subject-badge"
          style={{ backgroundColor: note.subjectId?.color }}
        >
          {note.subjectId?.name}
        </span>
      </div>

      <p className="note-preview">
        {note.content?.substring(0, 100)}
        {note.content?.length > 100 ? '...' : ''}
      </p>

      <div className="note-footer">
        <small>{new Date(note.createdAt).toLocaleDateString()}</small>
        <div className="note-card-actions">
          <button onClick={() => onEdit(note)} className="btn-sm btn-primary">
            Edit
          </button>
          <button onClick={() => onDelete(note._id)} className="btn-sm btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
