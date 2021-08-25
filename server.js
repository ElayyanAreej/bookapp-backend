"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const server = express();
server.use(cors());
server.use(express.json());

// Build a Mongoose 'Book' schema with valid keys for `title`, `description`, `status`, and `email` (of the user that added the Book).
//"mongodb://localhost:27017/book"

mongoose.connect(`${process.env.mongo_link}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// // use cats5

server.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});

//Schema
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  email: String,
});

//Model
const bookModel = mongoose.model("book", bookSchema);

function seedDataCollection() {
  const theNameJar = new bookModel({
    title: "The Name Jar",
    description:
      "Being the new kid in school is hard enough, but what happens when nobody can pronounce your name? Having just moved from Korea, Unhei is anxious about fitting in. So instead of introducing herself on the first day of school, she decides to choose an American name from a glass jar. But while Unhei thinks of being a Suzy, Laura, or Amanda, nothing feels right. With the help of a new friend, Unhei will learn that the best name is her own",
    status: "Available",
    email: "areej.hossein@gmail.com",
  });

  const corduroy = new bookModel({
    title: "Corduroy",
    description:
      "Celebrate 50 years of the beloved teddy bear 2018 marks Corduroys 50th anniversary, and Don Freeman’s classic character is even more popular today than he was when he first came on the scene. Now his original story is available in an unabridged, sturdy board book format, perfect for even the youngest readers.",
    status: "Available",
    email: "areej.hossein@gmail.com",
  });

  const theDayYouBegin = new bookModel({
    title: "The Day You Begin",
    description:
      "National Book Award winner Jacqueline Woodson and two-time Pura Belpré Illustrator Award winner Rafael López have teamed up to create a poignant, yet heartening book about finding courage to connect, even when you feel scared and alone.",
    status: "Available",
    email: "areej.hossein@gmail.com",
  });
  const test = new bookModel({
    title: "The Day You Begin",
    description:
    "National Book Award winner Jacqueline Woodson and two-time Pura Belpré Illustrator Award winner Rafael López have teamed up to create a poignant, yet heartening book about finding courage to connect, even when you feel scared and alone.",
    status: "Available",
    email: "yahya@gmail.com",
  });
  theNameJar.save();
  corduroy.save();
  theDayYouBegin.save();
  test.save();
}
//  seedDataCollection(); // npm start

server.get("/books", booksHandler);
server.post("/addBook", addBooksHandler);
// delete('/deleteCat/:catId2',deleteCatHandler);
// let bookData= await axios.delete(`${process.env.REACT_APP_SERVER}/deleteBook/${bookID}?email=${user.email}`)
server.delete("/deleteBook/:bookID", deleteBooksHandler);

// localhost:3001/books?email=areej.hossein@gmail.com
function booksHandler(req, res) {
  let reqemail = req.query.email;
  bookModel.find({ email: reqemail }, function (err, booksData) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(booksData);
      res.send(booksData);
    }
  });
}

//localhost:3001/books?title=aaaa&description=aaaa&status=aaaa&email=aaaa
function addBooksHandler(req, res) {
  console.log(req.body);
  let { title, description, status, email } = req.body;

  const newBook = new bookModel({
    title: title,
    description: description,
    status: status,
    email: email,
  });
  newBook.save();

  bookModel.find({ email }, function (err, booksData) {
    if (err) {
      console.log("error in getting the data");
    } else {
      console.log(booksData);
      res.send(booksData);
    }
  });
}

// http://localhost:3001/deleteBook/6124fbffdf486a4a492252dd?email=areej.hossein@gmail.com 

function deleteBooksHandler(req,res){
    //to get id from req 
let bookId= req.params.bookID;
console.log(bookId);
// to get email from req
let email=req.query.email;
console.log(email);

// to remove data has the id 
bookModel.remove({_id:bookId},(error,bookData)=>{
    if(error) {
        console.log('error in deleteing the data');
    } else {
        console.log('data deleted', bookData)
        bookModel.find({ email }, function (err, booksData) {
            if (err) {
                console.log('error in getting the data')
            } else {
                console.log(booksData);
                res.send(booksData)
            }
        })
    }
})




}