import jsonwebtoken from "jsonwebtoken";//Token
import bcryptjs from "bcryptjs";//Incriptar
import nodemailer from "nodemailer";//envia el correo
import crypto from "crypto";//codigo aleatorio

import clientsModel from "../models/customers.js";
import {config} from "../config.js";
import Mail from "nodemailer/lib/mailer/index.js";

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

    //Enviar el correo electronico
    //1.Transporter => Quien lo envia
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS}
    });

    //2.MailOptions => Quien lo recibe
    const MailOptions = {
        //¿Quien lo envia?
        from: config.email.email_user,
        //¿Quien lo recibe?
        to:email,
        //Asunto
        subject: "Verificacion de correo",
        //Cuerpo del correo electronica
        text: 'Para verificar tu correo utiliza el siguiente codigo ${verificationCode}\n El codigo vence en dos horas'       }
        //3.Enviar correo 
        transporter.sendMail(MailOptions, (error, info) => {
            if(error) return res.json({message: "Error"})

            console.log("Correo enviado" + info.response)
        })

        res.json({message: "Cliente registred, please verified your email with the code"})

} catch (error) {
    res.json({message: "Error" + error})
}
//Verificar el code
registerClientsController.verficationEmail = async (req, res) => {
    const {verficationCode} = req.body;

    //Obtengo el token que contiene el codigo de verificacion
    try{
        //Verificar y decodificar el token
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const {email, verficationCode: storedCode} = decoded;

        //Comparar el codigo que enviamos al correo con que el usuario escribe
        if(verficationCode !== storedCode){
            return res.json({message: "Invalid code"})
        }
        //Cambiamos el estado de "isverified" a true
        const client = await clientsModel.findOne({email});
        client.isVerified = true,
        await client.save();

        res.json({message: "Email verified sucessful"})

        //Quito la cookie con el token
        res.clearCookie("VerificationToken");
} catch (error){
    res.json({message: "error"});
}
};