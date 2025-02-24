import { useState, useEffect } from "react";

export const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const apiUrl = "https://backend-todoapp-68h5.onrender.com";


    // const apiUrl = "http://localhost:3000";

    //  Fetch all todos when the component loads
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await fetch(`${apiUrl}/todos`);
            if (!res.ok) throw new Error("Failed to fetch todos");
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            setError(err.message);
        }
    };

    //  Add Todo
    const handleSubmit = async () => {
        if (title.trim() === "" || description.trim() === "") {
            setError("Title and Description are required!");
            return;
        }
        
        try {
            const res = await fetch(`${apiUrl}/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            });

            if (!res.ok) throw new Error("Unable to create Todo item");

            const newTodo = await res.json();
            setTodos([...todos, newTodo]); //  Update state with new todo
            setMessage("Item added successfully!");
            setTimeout(()=>{
                setMessage("");

            },3000)
            setError("");
            setTitle("");
            setDescription("");
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete Todo
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Unable to delete Todo item");
            }

            //  Remove the deleted item from state
            setTodos(todos.filter(todo => todo._id !== id));
            setMessage("Item deleted successfully!");
            setError("");
        } catch (err) {
            setError(`Error: ${err.message}`);
            setMessage("");
        }
    };

    return (
        <>
            <div className="row p-3 bg-success text-light">
                <h1>Todo Project with MERN Stack</h1>
            </div>

            <div className="row">
                <h3>Add Item</h3>
                {message && <p className="text-success">{message}</p>}
                {error && <p className="text-danger">{error}</p>}

                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="Title"
                        className="form-control"
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <input
                        placeholder="Description"
                        className="form-control"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>

            <div className="row mt-4">
                <h3>Todo List</h3>
                {todos.length === 0 ? (
                    <p>No items found</p>
                ) : (
                    <ul className="list-group">
                        {todos.map((todo) => (
                            <li key={todo._id} className="list-group-item d-flex justify-content-between">
                                <span>
                                    <strong>{todo.title}</strong>: {todo.description}
                                </span>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(todo._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};



