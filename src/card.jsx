import "./card.css";

export default function Card({ name, spriteUrl, onClick }) {
  return (
    <button onClick={onClick}>
      <figure>
        <img src={spriteUrl} />
        <figcaption>{name}</figcaption>
      </figure>
    </button>
  );
}
