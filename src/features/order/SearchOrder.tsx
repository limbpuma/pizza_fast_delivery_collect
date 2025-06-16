import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [query, setQuery] = useState("");
  const navgiate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query) return;
    navgiate(`/order/${query}`);
    setQuery("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-28 rounded-full bg-yellow-100 px-4 py-2 text-sm 
        placeholder:text-stone-400 focus:outline-none sm:focus:w-72 
        focus:ring focus:ring-yellow-500 focus:ring-opacity-50 
        sm:w64 transition-all duration-300"
      />
    </form>
  );
}

export default SearchOrder;
