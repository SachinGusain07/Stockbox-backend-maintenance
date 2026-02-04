import express from 'express';
import { createIpo, deleteIpo, getAllIpos, updateIpo } from '../controller/Ipo/ipoController.js';
import { addIPOs, deleteIPOEntry, deleteIPOName, getIPOs } from '../controller/ipoController.js';
import { addIPOListing, deleteListingById, getIPOListings } from '../controller/ipoListingController.js';
import protectRoute from '../utils/protectRoute.js';


const iporouter = express.Router();

iporouter.post('/ipos', protectRoute , createIpo);       // Create a new IPO
iporouter.get('/ipos', getAllIpos); 
iporouter.delete('/ipos/:id',protectRoute ,deleteIpo)      // Get all IPOs
iporouter.put('/ipos/:id',protectRoute, updateIpo);

iporouter.post("/add", protectRoute ,addIPOs);  //upcomming 
iporouter.get("/", getIPOs);
iporouter.delete("/delete/:name", protectRoute, deleteIPOName);
iporouter.delete("/entry/:id", protectRoute ,  deleteIPOEntry);


iporouter.post("/addlist", protectRoute , addIPOListing);
iporouter.get("/list", getIPOListings);

iporouter.delete("/entrylist/:id", protectRoute , deleteListingById);

export default iporouter;
