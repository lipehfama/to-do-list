import { saveTodo } from "./todoFunctions";
import {
  db,
  collection,
  doc,
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
        ...doc.data(),
      });
    });

    return todos;
  } catch (error) {
    console.error("❌ Error getting todos from Firestore:", error);
    return [];
  }
};

export const loadTodos = async () => {
  /*
  const todos = getTodosLocalStorage();
  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
  */
  try {
    const todos = await getTodosLocalStorage();

    // Clear existing todos
    const taskList =
      document.querySelector("#todo-list") ||
      document.querySelector(".todo-list");

    if (taskList) {
      taskList.innerHTML = "";
    }

    //Create Dom elements for each todo
    for (const todo of todos) {
      await saveTodo(todo.text, todo.done, 0);

      //Add Firestore document ID to the latest created element
      const todoElements = document.querySelectorAll(".todo");
      const lastTodo = todoElements[todoElements.length - 1];
      if (lastTodo) {
        lastTodo.setAttribute("data-doc-id", todo.id);
      }
      console.log(`✅ Loaded ${todos.length} todos from Firestore`);
    }
  } catch (error) {
    console.error("❌ Error loading todos:", error);
  }
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

// Remove todo from Firestore by text
export const removeTodoLocalStorage = async (todoText) => {
  /*
  const todos = getTodosLocalStorage();
  const filteredTodos = todos.filter((todo) => todo.text != todoText);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
  */
  try {
    const q = query(collection(db, "todos"), where("text", "==", todoText));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docToDelete = querySnapshot.docs[0];
      console.log(docToDelete);
      await deleteDoc(doc(db, "todos", docToDelete.id));
      console.log("✅ Todo deleted from Firestore:", todoText);
      return docToDelete.id;
    } else {
      console.warn("⚠️ Todo not found for deletion:", todoText);
      return null;
    }
  } catch (error) {
    console.error("❌ Error removing todo from Firestore:", error);
    throw error;
  }
};

// Update todo status in Firestore
export const updateTodoStatusLocalStorage = async (todoText) => {
  /*
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
);
localStorage.setItem("todos", JSON.stringify(todos));
*/
  try {
    const q = query(collection(db, "todos"), where("text", "==", todoText));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const todoDoc = querySnapshot.docs[0];
      const currentData = todoDoc.data();

      await updateDoc(doc(db, "todos", todoDoc.id), {
        done: !currentData.done,
        updateAt: serverTimestamp(),
      });

      console.log("✅ Todo status updated in Firestore:", todoText);
      return todoDoc.id;
    } else {
      console.warn("⚠️ Todo not found for status update:", todoText);
      return null;
    }
  } catch (error) {
    console.error("❌ Error updating todo status in Firestore:", error);
    throw error;
  }
};

export const updateTodoLocalStorage = async (todoOldText, todoNewText) => {
  /*
  const todos = getTodosLocalStorage();
  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
);
   localStorage.setItem("todos", JSON.stringify(todos));
*/
  try {
    const q = query(collection(db, "todos"), where("text", "==", todoOldText));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const todoDoc = querySnapshot.docs[0];

      await updateDoc(doc(db, "todos", todoDoc.id), {
        text: todoNewText,
        updateAt: serverTimestamp(),
      });

      console.log("✅ Todo text updated in Firestore:", todoOldText, "->", todoNewText);
      return todoDoc.id;
    }
  } catch (error) {
    console.error("❌ Error updating todo text in Firestore:", error);
    throw error;
  }
};
