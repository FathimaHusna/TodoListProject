import { useEffect, useState } from "react";
export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //for Edit
  const [editId, setEditId] = useState(-1);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    setError("");
    // check inputs
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            // add item to list
            setTodos([...todos, { title, description }]);
            setTitle("")
            setDescription("")
            setMessage("Item Added Succesfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable to create todo items");
          }
        })
        .catch(() => {
          setError("Unable to create todo items");
        });
    }
  };

  //handle Edit
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };
  const handleEditCancel = () => {
    setEditId(-1)

  }

  //handle update
  const handleUpdate = () => {
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/"+editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            // update item to list

           const uptadedTodos = todos.map((item) => {
              if(item._id == editId){
                item.title=editTitle;
                item.description=editDescription;
              }
              return item

            })


            setTodos(uptadedTodos);
            setEditTitle("")
            setEditDescription("")
            setMessage("Item Updated Succesfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
            setEditId(-1)
          } else {
            setError("Unable to create todo items");
          }
        })
        .catch(() => {
          setError("Unable to create todo items");
        });
    }

  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the item?")){
      fetch(apiUrl+"/todos/"+id, {
        method: "DELETE"

      }).then(()=> {
        const uptadedTodos = todos.filter((item)=> item._id !== id)
        setTodos(uptadedTodos)
      })
   
    }
  }

  useEffect(() => {
    getItems();
  }, []);
  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  return (
    <>
      <div className="row p-3 bg-success text-light ">
        <h1>Create Your Todo List Here!!</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group ">
          <input
            className="form_control"
            placeholder="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
          />
          <input
            className="form-control mt-2"
            placeholder="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            type="text"
            
          />
          <button className="btn btn-success mt-2" onClick={handleSubmit}>
            submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>
      <div>
        <h2>Tasks</h2>
        <ul className="list-group">
          {todos.map((item) => (
            <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2 me-2">
              <div className="d-flex flex-column">
                {editId === -1 || editId !== item._id ? (
                  <>
                    <span className="fw-bold">{item.title}</span>
                    <span className="">{item.description}</span>
                  </>
                ) : (
                  <>
                    <div className="form-group ">
                      <input
                        className="form_control"
                        placeholder="title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        type="text"
                      />
                      <input
                        className="form-control mt-2"
                        placeholder="description"
                        onChange={(e) => setEditDescription(e.target.value)}
                        value={editDescription}
                        type="text"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="d-flex gap-2">
                {editId === -1 || editId !== item._id ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                ) : (
                  <button onClick={handleUpdate}>Update</button>
                )}
                { editId===-1 ?<button className="btn btn-danger" onClick= {()=> handleDelete(item._id)}>Delete</button>:
                <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
