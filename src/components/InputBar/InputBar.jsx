import "./InputBar.css";

export default function InputBar({ currentMessage, setCurrentMessage, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="input-bar">
      <input
        type="text"
        placeholder="Type a message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
