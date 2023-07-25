import express from "express";
import * as dotenv from "dotenv";
import {v2 as cloudinary} from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//get all posts
router.route('/').get(async(req,res) => {
    try{
        const posts = await Post.find({});
        res.status(200).json({success: true, data:posts})
    } catch(error) {
        res.status(500).json({success: false, message:error})
    }
})


//create a post
router.route('/').post(async(req,res) => {
    try {
        //get thte data from frontend
        const {name, prompt, photo} = req.body;

        //upload the photo on cloudinary and get the url
        const photoUrl = await cloudinary.uploader.upload(photo);

        // then create a new post in the database
        const newPost = await Post.create({
            name,
            prompt,
            photo:photoUrl.url,
        });
        res.status(201).json({success:true, data:newPost});
    } catch(error) {
        console.log(error || error.response);
        res.status(500).json(({success:false, message: "error"}));
    }
    
});

export default router;
