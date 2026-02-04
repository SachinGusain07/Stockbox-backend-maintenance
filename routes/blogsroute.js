import express from "express";


import reviewController from "../controller/reviewControllers.js";


import getReview from "../controller/getReview.js";

import email from "../controller/email.js";
import {getAllData, addEntry, updateEntry, deleteEntry} from "../controller/tabledata/TableData.js";
import { getAllDataY,addEntryY, updateEntryY, deleteEntryY } from "../controller/tableYearly/TableYeralyController.js";
import { deleteEvent, getEvent, uploadEvent } from "../controller/eventController.js";
import protectRoute from "../utils/protectRoute.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });




const blogRoute = express.Router();



blogRoute.get("/fetch-reviews", reviewController);
blogRoute.get("/review", getReview);



// Route for updating author
blogRoute.post("/sendmail"  , upload.single('pdf') , email);

blogRoute.get("/table", getAllData);     // Get all data
blogRoute.post("/table",protectRoute ,  addEntry);      // Add new entry
blogRoute.put("/table/:id", protectRoute, updateEntry); // Update entry by ID
blogRoute.delete("/table/:id", protectRoute, deleteEntry);

blogRoute.get("/tableYearly",  getAllDataY);
blogRoute.post("/tableYearly",protectRoute , addEntryY);
blogRoute.put("/tableYearly/:id", protectRoute, updateEntryY);
blogRoute.delete("/tableYearly/:id", protectRoute, deleteEntryY);     


blogRoute.post("/event/upload",protectRoute, uploadEvent); // Upload or update event image
blogRoute.get("/event", getEvent); // Fetch the latest event image
blogRoute.delete("/event", protectRoute , deleteEvent);


export default blogRoute;

