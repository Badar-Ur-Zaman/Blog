import {db} from '../db.js';
import jwt from 'jsonwebtoken';

export const getPosts = (req,res) => {
    const q = req.query.cat ? ("Select * From posts Where cat = ?") : ("Select * From posts") ;
    db.query(q, [req.query.cat], (err, data) => {
        if(err) return res.status(500).json(err)

        return res.status(200).json(data)
    })
};

export const getPost = (req,res) => {
    const q = `select p.id as postId, username, title, description, p.img as PostImg, u.img as UserImg, date, cat
    from users u join posts p
    on u.id = p.user_id
    where p.id = ?`

    db.query(q, [req.params.id], (err,data) => {
        if(err) return res.status(500).json(err)
        return res.status(200).json(data[0])
    })
};

export const deletePost = (req,res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated");

    jwt.verify(token, "jwtkey", (err,userInfo) => {
        if(err) return res.status(403).json("Invalid Token!");
        const postId = req.params.id
        const q = `delete from posts where id = ? AND user_id = ?`
        db.query(q, [postId, userInfo.id], (err, data) => {
            if(err) return res.status(403).json("Post not belong to you");
            return res.json("Post has been deleted!");
        })
    })
};

export const updatePost = (req,res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(401).json("Not Authenticated");

    jwt.verify(token, "jwtkey", (err,userInfo) => {
        if(err) return res.status(403).json("Invalid Token!");
        const postId = req.params.id;
        const q = `Update posts Set title=?, description=?, img=?, cat=? where id=? AND user_id=?`
        const values =[
            req.body.title,
            req.body.description,
            req.body.img,
            req.body.cat
        ];
        db.query(q, [values, ...postId, userInfo.id], (err, data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("Post has been created!");
        });
    });
};

export const addPost = (req,res) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated");

    jwt.verify(token, "jwtkey", (err,userInfo) => {
        if(err) return res.status(403).json("Invalid Token!");
        const q = `insert into posts(title, description, img, cat, date, user_id) Values (?)`
        const values =[
            req.body.title,
            req.body.description,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ];
        db.query(q, [values], (err, data)=>{
            if(err) return res.status(500).json(err);
            return res.status(200).json("Post has been created!");
        });
    });
};