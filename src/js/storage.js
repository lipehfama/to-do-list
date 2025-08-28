import { saveTodo } from "./todoFunctions";
import {
  db,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "./firebase";

//Get all todos from Firestore
export const getTodosLocalStorage = async () => {
  //const todos = JSON.parse(localStorage.getItem("todos")) || [];
  //console.log(todos);
  //return todos;
  try {
    const querySnapshot = await getDocs(collection(db, "todos"));
    const todos = [];

    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return todos;
  } catch (error) {
    console.error("❌ Error getting todos from Firestore:", error);
    return [];
  }
};

export const loadTodos = async () => {
  const todos = await getTodosLocalStorage();
  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

// Save todo to Firestore
export const saveTodoLocalStorage = async (todo) => {
  /*
  const todos = getTodosLocalStorage();
  todos.push(todo);
  console.log(todos)
  localStorage.setItem("todos", JSON.stringify(todos));
  */
  try {
    const docRef = await addDoc(collection(db, "todos"), {
      text: todo.text,
      done: todo.done || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("✅ Todo saved to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.log("❌ Error saving todo to firestore:", error);
    throw error;
  }
};

export const removeTodoLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  const filteredTodos = todos.filter((todo) => todo.text != todoText);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

export const updateTodoStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );
  localStorage.setItem("todos", JSON.stringify(todos));
};

export const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  );
  localStorage.setItem("todos", JSON.stringify(todos));
};
