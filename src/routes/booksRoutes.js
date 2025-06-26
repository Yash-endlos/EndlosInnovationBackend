// import express from 'express';
// import cloudinary from '../lib/cloudinary.js';
// import Book from '../models/Books.js';
// import protectRoute from '../middleware/auth.middleware.js';
// const router = express.Router();

// router.post("/" ,protectRoute,async(req,res)=>{
//   try {
    
//     const {title ,caption ,rating ,image} =req.body;
//     if(!image || !title || !caption ||!rating)
//     {
//       return res.status(400).json({message:"Please provide an all fields"})
//     }
//       // upload the image to cloudinary
//     const uploadResponse= await cloudinary.uploader.upload(image);

//     const imageUrl = uploadResponse.secure_url
  
//     //save to database
//     const newBook = new Book({
//       title , 
//       caption,
//       rating,
//       image:imageUrl,
//       user:req.user._id,
//     })

//     await newBook.save();
//     res.status(201).json(newBook)

//   } catch (error) {
//     console.log("Error creating book",error)
//     res.status(500).json({message:"error.message"})
//   }
// })

// //pagination => infinite loading
// router.get("/" ,protectRoute ,async(req,res)=>{
//   try {
//     const page = req.query.page || 1;
//     const limit = req.query.limit || 2;
//     const skip = (page-1)*limit

//     const books = await Book.find().sort({createdAt:-1})    // descending
//     .skip(skip)
//     .limit(limit)
//     .populate("user","username profileImage");

//     const totalBooks = await Book.countDocuments();
//     res.send({
//       books,
//       currentPage:page,
//       totalBooks,
//       totalPages:Math.ceil(totalBooks/limit)
//     });
//   } catch (error) {
//     console.log("Error in getting all the  book",error)
//     res.status(500).json({message:"internal server error "})
//   }
// });

// //get recomendation books by the logged in user
// router.get("/user" ,protectRoute,async(req,res)=>{
//   try {
//     const books = await Book.find({user:req.user._id}).sort({createdAt:-1});
//     res.json(books);
//   } catch (error) {
//     console.error("Get user books error : ",error.error)
//     res.status(500).json({message:"Serber Error"})
//   }
// })

// // router.delete("/:id" ,protectRoute,async(req,res)=>{
// // try {
// //   const book = await Book.findById(req.params.id);
// //   if(!book) return res.status(404).json({message:"Book not found"})

// //     //check if user is the creator of the book
// //   if(book.user.toString()!== req.user._id.toString())
// //     return res.status(404).json({message:"Unauthorized"})

// //   //delete the image from cloudinary as well
// //   if(book.image && book.image.includes("cloudinary")){
// //     try {
// //       const publicId = book.image.split("/").pop().split(",")[0];
// //       await cloudinary.uploader.destroy(publicId);
// //     } catch (deleteError) {
// //       console.log("Error deleting image from cloudinary ",deleteError)
      
      
// //     }
// //   }
// //   await book.deleteOne();
// //   res.json({message:"book deleted successfully"})

// // } catch (error) {
// //   res.status(500).json({ message: "Server Error" });
// // }
// // })

// router.delete("/:id", protectRoute, async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     if (book.user.toString() !== req.user._id.toString())
//       return res.status(401).json({ message: "Unauthorized" });

//     if (book.image && book.image.includes("cloudinary")) {
//       try {
//         const publicId = book.image.split("/").pop().split(".")[0];
//         await cloudinary.uploader.destroy(publicId);
//       } catch (deleteError) {
//         console.error("Error deleting image from cloudinary", deleteError);
//       }
//     }

//     await book.deleteOne();
//     res.json({ message: "Book deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting book:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });



// export default router;
