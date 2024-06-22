// const fs = require("fs");
// const express = require("express");

// const app = express();

// app.use(express.json());


// let books=[]
// // Read all books
// app.get("/books", (req, res) => {
//   fs.readFile("./books.json", "utf-8", (err, data) => {
//     if (err) {
//       res.status(500).json({ error: "Server error" });
//     } else {
//       res.json(JSON.parse(data));
//     }
//   });
// });

// app.get("/books/:id", (req, res) => {
//   let id = req.params.id;

//   fs.readFile("./books.json", "utf-8", (err, data) => {
//     if (err) {
//       res.status(500).json({ error: "Server error" });
//     } else {
//       let book = JSON.parse(data);
//       let specificBook = book.filter((item) => {
//         return item.id !== id;
//       });
//       res.status(200).json(specificBook);
//     }
//   });
// });

// app.post("/books", (req, res) => {
//   const { title, author, publication } = req.body;

//   if (!title || !author || !publication) {
//     return res.status(400).json({ message: "all things are required" });
//   }

//   let newbook = { title, author, publication };
  
//   fs.readFile("./books.json", "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).json({ error: "Server error" });
//     } else {
//       let books = JSON.parse(data);
//       books.push({ ...newbook, id: books.length + 1 });
//       fs.writeFile("./books.json", JSON.stringify(books, null, 2), (err) => {
//         if (err) {
//           return res.status(500).json({ err: "something went wrong" });
//         } else {
//           return res
//             .status(201)
//             .json({ message: "user created Succeessfully" });
//         }
//       });
//     }
//   });

//   console.log(title);
// });

// app.put('/books/:id', (req, res) => {
//   const id =Number(req.params.id);
//   const { title, author, publication } = req.body;

//   if (!title || !author || !publication) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   fs.readFile('./books.json', 'utf-8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ message: 'Server Error' });
//     }

//     let books;
//     try {
//       books = JSON.parse(data);
//     } catch (parseError) {
//       return res.status(500).json({ message: 'Error parsing JSON data' });
//     }

//     // Debugging: Log the books array to see its contents
//     console.log('Books Array:', books);

//     // Find the index of the book with the given id
//     let bookIndex = -1;

//     // Find the index of the book with the given id using a for loop
//     for (let i = 0; i < books.length; i++) {
//       if (books[i].id === id) {
//         bookIndex = i;
//         break;
//       }
//     }

//     // Debugging: Log the index found by findIndex
//     // console.log('Found Book Index:', bookIndex);

//     if (bookIndex === -1) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     // Update the book with the new data
//     books[bookIndex] = { ...books[bookIndex], title, author, publication };

//     // Write the updated data back to the JSON file
//     fs.writeFile('./books.json', JSON.stringify(books, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ message: 'Something went wrong while writing to the file' });
//       }
//       res.status(200).json({ updatedBook: books[bookIndex] });
//     });
//   });
// });

// app.delete("/books/:id", (req, res) => {
//   let id = Number(req.params.id); // Assuming id is a string
//   console.log(typeof id);

//   fs.readFile('./books.json', 'utf8', (err, data) => {
//     if (err) {
//       return res.status(500).json({ message: "Something went wrong! Server Error" });
//     }

//     let bookdata = JSON.parse(data);
    
//     // Filter out the book with the specified id
//     let deleteData = bookdata.filter((item) => item.id !== id);

//     console.log(deleteData);
//     // Write the filtered data back to the JSON file
//     fs.writeFile("./books.json", JSON.stringify(deleteData, null, 2), (err) => {
//       if (err) {
//         return res.status(500).json({ message: "Server Error" });
//       }
//       res.json({ message: "Book removed" });
//     });
//   });
// });


const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Sample data structure to store the collection of books.
let books = [
  { id: 1, title: 'Book1', author: 'Author1', publicationYear: 2020 }
];
let currentId = 2; // Simulating auto incrementing IDs

// GET /books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// GET /books/:id
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// POST /books
app.post('/books', (req, res) => {
  const newBook = {
    id: currentId++,
    title: req.body.title,
    author: req.body.author,
    publicationYear: req.body.publicationYear
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (book) {
    Object.assign(book, req.body);
    res.status(200).json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// DELETE /books/:id
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex !== -1) {
    const [deletedBook] = books.splice(bookIndex, 1);
    res.status(200).json(deletedBook);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});




const server = app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
