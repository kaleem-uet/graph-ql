import { gql, useQuery } from "@apollo/client";
import "./App.css";

const GET_TODOS_WITH_USERS = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      userId
      user {
        id
        name
      }
    }
  }
`;

function App() {
  const { data, error, loading } = useQuery(GET_TODOS_WITH_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Todos List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>User ID</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {data.getTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td>{todo.userId}</td>
              <td>{todo.user?.name || "Unknown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
