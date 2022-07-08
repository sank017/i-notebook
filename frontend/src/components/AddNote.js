import React, {useContext, useState} from 'react'
import noteContext from '../context/notes/noteContext'

export default function AddNote(props) {

    const context = useContext(noteContext);
    const {addNote} = context;
    const [note, setnote] = useState({title:"", description:"", tag:""})
    const handleClick = (e)=>{
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setnote({title: "", description: "", tag: ""})
        props.showAlert("Note Added Successfully", "success")
    }

    const onChange = (e)=>{
        setnote({...note,[e.target.name]:e.target.value})
    }

  return (
    <div className="container my-5">
    <h1>Add a Note</h1>
    <form>
<div className="mb-3">
  <label htmlFor="title" className="form-label">title</label>
  <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required/>
</div>
<div className="mb-3">
  <label htmlFor="description" className="form-label">Description</label>
  <input type="text" className="form-control" value={note.description} id="description" name='description' onChange={onChange} minLength={5} required/>
</div>
<div className="mb-3">
  <label htmlFor="tag" className="form-label">Tag</label>
  <input type="text" className="form-control" value={note.tag} id="tag" name='tag' onChange={onChange} minLength={5} required/>
</div>
<button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick} >Add Note</button>
</form>
</div>
  )
}
 