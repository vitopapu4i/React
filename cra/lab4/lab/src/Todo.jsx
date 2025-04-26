import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleComplete, deleteTodo, setFilter } from "./todoSlice";

const Todo = () => {
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const todos = useSelector((state) => state.todos.todos);
  const filter = useSelector((state) => state.todos.filter);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  };

  const handleAddTodo = () => {
    if (text.trim()) {
      dispatch(addTodo({ text, deadline }));
      setText("");
      setDeadline("");
    }
  };

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleFilterChange = (filter) => {
    dispatch(setFilter(filter));
  };

 
  const getDeadlineColor = (deadline) => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - currentDate;
    const oneDay = 24 * 60 * 60 * 1000; 

    if (timeDiff < 0) {
      return "red"; 
    } else if (timeDiff > oneDay) {
      return "green"; 
    } else {
      return "yellow"; 
    }
  };

  const getTodosToShow = () => {
    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }
    return todos; 
  };

  const groupByDate = (todos) => {
    return todos.reduce((acc, todo) => {
      const date = new Date(todo.deadline).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(todo);
      return acc;
    }, {});
  };

  const groupedTodos = groupByDate(getTodosToShow());

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Add new todo"
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={handleDeadlineChange}
        placeholder="Deadline"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <div>
        <button onClick={() => handleFilterChange("all")}>All</button>
        <button onClick={() => handleFilterChange("active")}>Active</button>
        <button onClick={() => handleFilterChange("completed")}>Completed</button>
      </div>
      <div>
        {Object.entries(groupedTodos).map(([date, todos]) => (
          <div key={date}>
            <h3>{date}</h3>
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                  />
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.text}
                  </span>
                  {!todo.completed && todo.deadline && (
                    <span
                      style={{
                        color: getDeadlineColor(todo.deadline),
                        marginLeft: "10px",
                      }}
                    >
                      {new Date(todo.deadline).toLocaleString()}
                    </span>
                  )}
                  {todo.completed && todo.completedDate && (
                    <span
                      style={{
                        color: "gray",
                        marginLeft: "10px",
                      }}
                    >
                      Completed on: {new Date(todo.completedDate).toLocaleString()}
                    </span>
                  )}
                  <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;