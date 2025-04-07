import jsonwebtoken from "jsonwebtoken";//Token
import bcryptjs from "bcryptjs";//Incriptar
import nodemailer from "nodemailer";//envia el correo
import crypto from "crypto";//codigo aleatorio

import clientsModel from "../models/customers.js";
import {config} from "../config.js";

//Creamos un array de funciones
const registerClientsController = {};

registerClientsController.register = async (req, res) => {

//1.Solicitar las cosas que vamos a guardar
const {name, lastname, birthday, email, password, telephone, dui, isverified} = req.body;
}

try {
    //Verificamos si el cliente existe 
    const existsClients = await clientsModel.findOne({email})
    if(existsClients){
        return res.json({message: "Client Already exists"})
    }
    //Encritar contraseña
    const passwordHash = await bcryptjs.hash(password, 10)

    //Guardo al cliente en la bd
    const newClient = new clientsModel(
        {name,
        lastname, 
        birthday, 
        email, 
        password:passwordHash, 
        telephone,
        dui: dui || null, 
        isverified: isverified || false}
    );

    await newClient.save();

    //Generamos un codigo aleatorio
    const verficationCode = crypto.randomBytes(3).toString("hex")

    //Crear el token
    const tokenCode = jsonwebtoken.sign(
    //1.Que vamos a guardar
    {email, verficationCode},
    //2.Palabra secreta
    config.JWT.secret,
    //3.Cuando expira
    {expiresIn: "2h"}
    )
    
    res.cookie("verificationToken", tokenCode, {maxAge: 2*60*60*1000})
} catch (error) {
    
}