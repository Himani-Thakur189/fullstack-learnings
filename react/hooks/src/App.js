import "./App.css";
import useFetch from "./hooks/useFetch";

function App() {
  const { data, loading, error, fetchData } = useFetch(
    "http://localhost:3000/feed",
  );

  console.log("data", data, loading, error);
  return (
    <div className="App">
      <h1>Data is here</h1>
      <button onClick={() => fetchData()}>Load</button>
      <ul>
        {data?.data?.map((item) => {
          return <li>{item.firstName} </li>;
        })}
      </ul>
    </div>
  );
}

export default App;
