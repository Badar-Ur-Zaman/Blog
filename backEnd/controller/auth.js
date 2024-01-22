import {db} from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
    // Check if user already exists

    const q = "SELECT * FROM users WHERE email = ? OR username = ?";

    db.query(q, [req.body.email, req.body.username], (err, data) => {
        if(err) return res.json(err)
        if(data.length > 0) return res.status(409).json("User Already Exist")

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        
        const insertQuery = 'insert into users(username, email, password) Values(?,?,?)';
        const values = [req.body.username, req.body.email, hash];
        
        db.query(insertQuery, values, (err, data) => {
            if(err) return res.json(err)
            if(data){
                return res.status(201).json("user has been created!");
            }
        })
    })

};


export const login = (req, res) => {
    //Check user exist or not
    const q = 'select * from users where username = ?'
    db.query(q, [req.body.username], (err, data) => {
        if(err) return res.json(err)
        if(data.length === 0) return res.status(404).json("User not found!");
        //Check password
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password, 
            data[0].password
        );
        
        if(!isPasswordCorrect) return res.status(400).json("Wrong username or password!")
        
        const token = jwt.sign({id: data[0].id}, "jwtkey");
        // const { password, ...hehe } = data[0];
        
        res.cookie("access_token", token, {
            httpOnly:true,
            sameSite:'None',
            secure:true
        }).status(200).json(data);
    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none", 
        secure: true
    })
    .status(200)
    .json("User has been logged out");
}