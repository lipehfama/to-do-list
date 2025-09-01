import { saveTodo } from "./todoFunctions";
import { getDeviceId } from "./deviceId";
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
  try {
    const deviceId = getDeviceId();
    //Query only todos for this device
    const q = query(collection(db, "todos"), where("deviceId", "==", deviceId));
    const querySnapshot = await getDocs(q);
    const todos = [];

    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`📱 Found ${todos.length} todos for device: ${deviceId}`);
    return todos;
  } catch (error) {
    console.error("❌ Error getting todos from Firestore:", error);
    return [];
  }
};

export const loadTodos = async () => {
  try {
    const todos = await getTodosLocalStorage();

    //Clear existing todos
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

//Save todo to Firestore
export const saveTodoLocalStorage = async (todo) => {
  try {
    const deviceId = getDeviceId();
    const docRef = await addDoc(collection(db, "todos"), {
      text: todo.text,
      done: todo.done || false,
      deviceId: deviceId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ Todo saved for device ${deviceId} with ID:`, docRef.id);
    return docRef.id;
  } catch (error) {
    console.log("❌ Error saving todo to firestore:", error);
    throw error;
  }
};

//Remove todo from Firestore by text
export const removeTodoLocalStorage = async (todoText) => {
  try {
    const deviceId = getDeviceId();
    const q = query(
      collection(db, "todos"),
      where("text", "==", todoText),
      where("deviceId", "==", deviceId)
    );
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

//Update todo status in Firestore
export const updateTodoStatusLocalStorage = async (todoText) => {
  try {
    const deviceId = getDeviceId();
    const q = query(
      collection(db, "todos"),
      where("text", "==", todoText),
      where("deviceId", "==", deviceId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const todoDoc = querySnapshot.docs[0];
      const currentData = todoDoc.data();

      await updateDoc(doc(db, "todos", todoDoc.id), {
        done: !currentData.done,
        deviceId: deviceId,
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
  try {
    const deviceId = getDeviceId();
    const q = query(
      collection(db, "todos"),
      where("text", "==", todoOldText),
      where("deviceId", "==", deviceId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const todoDoc = querySnapshot.docs[0];

      await updateDoc(doc(db, "todos", todoDoc.id), {
        text: todoNewText,
        deviceId: deviceId,
        updateAt: serverTimestamp(),
      });

      console.log(
        "✅ Todo text updated in Firestore:",
        todoOldText,
        "->",
        todoNewText
      );
      return todoDoc.id;
    } else {
      console.warn("⚠️ Todo not found for text update:", todoOldText);
      return null;
    }
  } catch (error) {
    console.error("❌ Error updating todo text in Firestore:", error);
    throw error;
  }
};

//Helper functions using document ID
export const removeTodoById = async (docId) => {
  try {
    const deviceId = getDeviceId();
    // Update with device ID to ensure security rules pass
    await updateDoc(doc(db, "todos", docId), {
      deviceId: deviceId,
    });
    await deleteDoc(doc(db, "todos", docId));
    console.log("✅ Todo deleted by ID:", docId);
  } catch (error) {
    console.error("❌ Error deleting todo by ID:", error);
    throw error;
  }
};

export const updateTodoStatusById = async (docId, isDone) => {
  try {
    await updateDoc(doc(db, "todos", docId), {
      done: isDone,
      updateAt: serverTimestamp(),
    });
    console.log("✅ Todo status updated by ID:", docId);
  } catch (error) {
    console.error("❌ Error updating todo status by ID:", error);
    throw error;
  }
};
