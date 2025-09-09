import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TodoScreen = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [todos, setTodos] = useState([]);
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTodos = () => {
    axios
      .post("http://localhost:8000/viewtodo", { userId }, { headers: { token } })
      .then((res) => setTodos(res.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const addTodo = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please enter both title and description");
      return;
    }

    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    axios
      .post(
        "http://localhost:8000/create",
        { ...formData, userId },
        { headers: { token } }
      )
      .then((res) => {
        setTodos([...todos, res.data]);
        setFormData({ title: "", description: "" });
      })
      .catch((error) => console.error(error));
  };

  const deleteTodo = (id) => {
    const token = sessionStorage.getItem("token");

    axios
      .delete(`http://localhost:8000/delete/${id}`, {
        headers: { token },
      })
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((error) => console.error(error));
  };

  const toggleStatus = (id) => {
    const token = sessionStorage.getItem("token");

    axios
      .put(
        `http://localhost:8000/status/${id}`,
        {},
        { headers: { token } }
      )
      .then((response) => {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? response.data.data : todo
          )
        );
      })
      .catch((error) => console.error(error));
  };

  const editTodo = (id) => {
    const newTitle = prompt("Enter new title:");
    const newDescription = prompt("Enter new description:");
    if (newTitle && newDescription) {
      const token = sessionStorage.getItem("token");

      axios
        .put(
          `http://localhost:8000/edit/${id}`,
          { title: newTitle, description: newDescription },
          { headers: { token } }
        )
        .then((response) => {
          setTodos(
            todos.map((todo) =>
              todo._id === id ? response.data.data : todo
            )
          );
        })
        .catch((error) => console.error(error));
    }
  };

  
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="todo-container">
      <style>
        {`
           body{
            background-color: lightblue
            }
          .todo-container {
            max-width: 500px;
            margin: 10px auto;
            padding: 15px;
          }
          .todo-heading {
            text-align: center;
            margin-bottom: 15px;
          }
          .todo-input,
          .todo-textarea {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
            border: 2px solid black;
            
          }
          .todo-add-btn {
            padding: 8px 16px;
            margin-bottom: 15px;
            cursor: pointer;
            color: white;
            background-color: green;
          }
          .todo-list {
            list-style: none;
            padding: 0;
          }
          .todo-item {
            border: 2px solid black;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
          }
          .todo-title {
            margin: 0;
          }
          .todo-description {
            margin: 5px 0;
          }
          .todo-status-btn{
            margin-right: 8px;
            padding: 5px 10px;
            cursor: pointer;
            background-color: green;
          }
          .todo-edit-btn{
            margin-right: 8px;
            padding: 5px 10px;
            cursor: pointer;
            background-color: blue;
          }
          .todo-delete-btn {
            margin-right: 8px;
            padding: 5px 10px;
            cursor: pointer;
            background-color: red;
          }
          .todo-logout-btn {
            display: block;
            margin: 15px auto;
            padding: 8px 16px;
            cursor: pointer;
            color: white;
            background-color: darkred;
            border: none;
            border-radius: 5px;
          }
        `}
      </style>

      <h2 className="todo-heading">Todo List</h2>

      <button onClick={handleLogout} className="todo-logout-btn">
        Logout
      </button>

      <input
        type="text"
        name="title"
        placeholder="Enter Title"
        value={formData.title}
        onChange={handleInput}
        className="todo-input"
      />
      <textarea
        name="description"
        rows="3"
        placeholder="Enter Description"
        value={formData.description}
        onChange={handleInput}
        className="todo-textarea"
      />
      <button onClick={addTodo} className="todo-add-btn">
        Add
      </button>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <h3 className="todo-title">{todo.title}</h3>
            <p className="todo-description">{todo.description}</p>

            <button
              onClick={() => toggleStatus(todo._id)}
              className="todo-status-btn"
            >
              {todo.status === "Pending" ? "Completed" : "Pending"}
            </button>
            <button
              onClick={() => editTodo(todo._id)}
              className="todo-edit-btn"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="todo-delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoScreen;
