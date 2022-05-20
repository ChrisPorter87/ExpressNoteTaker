const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const path = require("path");
const app = express();

//parse incoming string data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());
app.use(express.static("public"));

const { notes } = require("./db/db");

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public.index.html"));
});
app.post("/api/notes", (req, res) => {
  req.body.id = notes.length.toString();
  if (!validateNote(req.body)) {
    res.status(400).send("The note is not properly formatted.");
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});
// app.get('/notes', (req, res) => {
//   res.sendFile(path.join(__dirname, './public/notes.html'));
// });
function validateNote(note) {
  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  let note;

  notes.map((element, index) => {
    if (element.id == id) {
      note = element;
      notes.splice(index, 1);
      return res.json(note);
    }
  });
});
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});
