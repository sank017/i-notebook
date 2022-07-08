const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//ROUTE 1 : Get all the Notes using GET  "/api/notes/fetchallnotes" login required
router.get('/fetchallnotes', fetchuser , async (req,res)=>{

    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
   
}) 

//ROUTE 2 : Get all the Notes using GET  "/api/notes/addnotes" login required
router.post('/addnote', fetchuser ,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Descrition must be atleast 5 characters').isLength({ min: 5 }),
], async (req,res)=>{

    try {
        const { title, description, tag} = req.body;
        //if there are errors , return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description , tag ,user: req.user.id
        })
        const savedNote = await note.save()
    
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

  
}) 

//ROUTE 3 : Update an existing Notes using PUT  "/api/notes/uodatenote" login required
router.put('/updatenote/:id', fetchuser , async (req,res)=>{
    const {title, description, tag} = req.body;

    try {
        //create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //find the note to be updated
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("NOt Found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})
    res.json({note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    

})

//ROUTE 4 : Update an existing Notes using DELETE  "/api/notes/deletenote" login required
router.delete('/deletenote/:id', fetchuser , async (req,res)=>{
    const {title, description, tag} = req.body;
    try {
         //find the note to be deleted
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("NOt Found")}

    //allow deletion only is user owns this Note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"success": "Note has been deleted", note: note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
   
   

})

module.exports = router