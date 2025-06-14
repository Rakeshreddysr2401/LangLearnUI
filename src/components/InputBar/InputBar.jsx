import "./InputBar.css";

const InputBar = ({ currentMessage, setCurrentMessage, onSubmit }) => {
  const handleChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="input-bar">
      <input
        type="text"
        placeholder="Type a message..."
        value={currentMessage}
        onChange={handleChange}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default InputBar;
