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

// index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Data structure to store books (initially empty)
let books = [];

// Routes
// GET /books - Retrieve all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books/:id - Retrieve a specific book by ID
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(book => book.id === id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

// POST /books - Create a new book
app.post('/books', (req, res) => {
  const { title, author, publication } = req.body;

  if (!title || !author || !publication) {
    return res.status(400).json({ message: 'All fields (title, author, publication) are required' });
  }

  const id = books.length > 0 ? books[books.length - 1].id + 1 : 1;
  const newBook = { id, title, author, publication };
  books.push(newBook);

  res.status(201).json({ message: 'Book created successfully', book: newBook });
});

// PUT /books/:id - Update a book by ID
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, publication } = req.body;

  if (!title || !author || !publication) {
    return res.status(400).json({ message: 'All fields (title, author, publication) are required' });
  }

  let updated = false;
  books = books.map(book => {
    if (book.id === id) {
      updated = true;
      return { ...book, title, author, publication };
    }
    return book;
  });

  if (!updated) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json({ message: 'Book updated successfully' });
});

// DELETE /books/:id - Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const initialLength = books.length;
  books = books.filter(book => book.id !== id);

  if (books.length === initialLength) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json({ message: 'Book deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




const server = app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
