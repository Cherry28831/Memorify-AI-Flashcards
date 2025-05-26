import React from "react";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const { data, error, isLoading } = useQuery(["flashcards"], () =>
    fetch(`${apiUrl}/flashcards`).then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Flashcards</h1>
      <ul>
        {data.map((card) => (
          <li key={card.id}>{card.question}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
