import { book, book } from "../models/bookModel";

class BooksRepository{
    //Properties
    static ID = "_id";

    //TODO: create a better implementation of the newBook functionality
    constructor(book="") {
        this.book = book
    }

    postBook(book) {//Add a new book
      
    try {
        //Check if the book already exists
      this.books = book;

    } catch (error) {
    
    }
    }



    getBookById(id) {//Get the book

    }

    findBook(book) {//Check if the book exists
        try {
            // let justBook = book.findOne({book[0]:book[1]});

        } catch (error) {
            throw error;
        }
    } 
}