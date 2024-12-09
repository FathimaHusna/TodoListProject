import { useEffect, useState } from 'react';
export default function Todo() {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [todos, setTodos] =useState([])
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
  
    const apiUrl = "http://localhost:8000"

    
    const handleSubmit = () => {
      setError("")
      // check inputs
      if(title.trim() !== '' && description.trim() !== ''){

        fetch(apiUrl+"/todos", {
          method: "POST",
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify({title, description})
        }).then((res)=> {
          if (res.ok) {
            // add item to list
        setTodos([...todos, {title, description}])
        setMessage("Item Added Succesfully")
        setTimeout(()=> {
          setMessage("")
  

        }, 3000)


          } else {
            setError("Unable to create todo items")

          } 
        }).catch(()=> {
          setError("Unable to create todo items")

        })

        

      }
    }
    useEffect(() => {
      getItems()
    },[])
    const getItems =()=> {
      fetch(apiUrl+"/todos")
      .then((res) => res.json())
      .then((res)=> {
        setTodos(res)
      })

    }

  return (
    <>
      <div className="row p-3 bg-success text-light ">
        <h1>the to do list compo</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
       {message && <p className="text-success">{message}</p>}
<div className="form-group ">
<input className="form_control" placeholder="title" onChange= {(e)=> setTitle(e.target.value)} value = {title} type="text"/>
<textArea className="form-control mt-2" rows="5" placeholder="description"  onChange = {(e)=> setDescription(e.target.value)} value={description}/>
<button className="btn btn-success mt-2" onClick = {handleSubmit}>submit</button>
</div>
      {error &&<p className='text-danger'>{error}</p> } 
      </div>
      <div>
        <h2>Tasks</h2>
        <ul className='list-group'>
          {
            todos.map((item)=> 
              <li className='list-group-item bg-info d-flex justify-content-between align-items-center my-2' >
            <div className='d-flex flex-column'>
            <span className='fw-bold'>{item.title}</span>
            <span className=''>{item.description}</span>
            </div>
            <div className='d-flex gap-2'>
              <button className='btn btn-warning'>Edit</button>
              <button className='btn btn-danger'>Delete</button>
            </div>

          </li>)
          }
        


        </ul>
      </div>
    </>
  );
}
