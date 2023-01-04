import React, { useEffect, useState } from "react";
import "./App.css";
import InputField from "./components/InputField";
import { Todo } from "./model";
import TodoList from "./components/TodoList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (localStorage.getItem("todoList")) {
      // localStorage return type is string or null, when declare the data the
      // value i null until you render the component, so use the || operator to add
      // a string to it so its not null anymore
      const storedToDoList = JSON.parse(localStorage.getItem("todoList") || "");
      setTodos(storedToDoList);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("completedToDoList")) {
      const storedCompletedToDoList = JSON.parse(
        localStorage.getItem("completedToDoList") || ""
      );
      setCompletedTodos(storedCompletedToDoList);
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      // todo is just todo as its the same name, shorthand for todo: todo
      setTodos([...todos, { id: Date.now(), todo, isDone: false }]);
      localStorage.setItem(
        "todoList",
        JSON.stringify([...todos, { id: Date.now(), todo, isDone: false }])
      );
    }

    setTodo("");
  };

  // console.log(todos, "todos");

  const onDragEnd = (result: DropResult) => {
    // console.log(result);
    const { source, destination } = result;
    // console.log(source, "source");
    // console.log(destination, "destination");

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    let add;
    let active = todos;
    console.log(active);
    let complete = completedTodos;

    if (source.droppableId === "TodosList") {
      add = active[source.index];
      // console.log(add);
      // console.log(active.splice(source.index, 1));
      active.splice(source.index, 1);
      // console.log(active);
      // find the index of the todo that has been removed
      // from the active tasks, and remove it from the todos array
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
      // console.log(complete);
      // if the to do list item is going from completed tasks
      // to active tasks, then the the above removes that to do from completed array
    }

    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
      console.log(add);
      // adds the todo list item onto the active todos list
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    localStorage.setItem("completedToDoList", JSON.stringify(complete));

    setTodos(active);
    localStorage.setItem("todoList", JSON.stringify(active));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Taskify</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          completedTodos={completedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
