import jsonwebtoken from "jsonwebtoken"; //token
import bcrypt from "bcryptjs";//Encriptar

import clientsModel from "../models/customers.js";
import employeeModel from "../models/employee.js";

import { sendEmail, HTMLRecoveryEmail } from "../utils/emailPasswordRecovery.js";
import { config } from "../config.js";
import { verify } from "crypto";
import { userInfo } from "os";

//Crear un array de funciones
const PasswordRecoveryController = {};
PasswordRecoveryController.requestCode = async(req, res) => {
    const{email} = req.body;

    try {
        let userFound;
        let userType;

        userFound = await clientsModel.findOne({email});
        if(userFound){
            userType = "client";
        }else{
            userFound = await employeeModel.findOne({email});
            userType = "employee";
        }

        if (!userFound) {
            return res.json({message: "User not found"})
        } 
        //Generar un codigo de 5 digitos
        code = Math.floor(10000 + Math.random()* 60000).toString

        //Ultimo paso generar un token
        const token =  jsonwebtoken.sign(
            //1 Que voy a guardar?
            {email, code, userType, verified:false },
            //2 secret key
            config.JWT.secret,
            //3.Cuando expira
            {expiresIn: "25m"}
        )
        res.cookie("tokenRecoveryCode", token, {maxAge: 25 * 60 * 1000})
        await sendEmail(
            email,
            "password recoverid code",
            `your verification code is ${code}`,
            HTMLRecoveryEmail(code)
          );
          res.json({message: "Verfufucatuib cide send"});
           }catch (error){
            console.log("error" + error);
           }
        };

      //////// VERIFICAR EL CÓDIGO QUE ME ENVIARON POR CORREO
passwordRecoveryController.verifyCode = async (req, res) => {
    const { code } = req.body;
   
    try {
      // Obtener el token que esta guardado en las cookies
      const token = req.cookies.tokenRecoveryCode;
   
      // Extraer todos los datos del token
      const decoded = jsonwebtoken.verify(token, config.JWT.secret);
   
      // Comparar el código que está guardado en el token
      // con el código que el usuario escribió
      if (decoded.code !== code) {
        return res.json({ message: "Invalid code" });
      }
   
      //Marcamos el token como verificado (si es correcto)
      const newToken = jsonwebtoken.sign(
        //1- ¿Que vamos a guardar?
        {
          email: decoded.email,
          code: decoded.code,
          userType: decoded.userType,
          verfied: true,
        },
        //2- secret key
        config.JWT.secret,
        //3- ¿cuando vence?
        { expiresIn: "25m" }
      );
   
      res.cookie("tokenRecoveryCode", newToken, { maxAge: 25 * 60 * 1000 });
   
      res.json({ message: "Code verified successfully" });
    } catch (error) {
      console.log("error" + error);
    }
  };
   
  passwordRecoveryController.newPassword = async (req, res) => {
    const{newPassword} = req.body;
   
    try {
   
      const token = req.cookies.tokenRecoveryCode
   
      const decoded = jsonwebtoken.verify(token, config.JWT.secret)
   
      if(decoded.verfied){
        return res.json({ message: "code not verified"});
      }
   
      let user;
   
      const hashedPassword = await bcryptjs.hash(newPassword, 10)
   
      if(decoded.userType === "client"){
        user = await clientsModel.findByIdAndDelete(
          {email},
          {password: hashedPassword},
          {new: true},
        )
      }else if( decoded.userType === "employes"){
        user = await clientsModel.findByIdAndDelete(
          {email},
          {password: hashedPassword},
          {new: true},
        )
    }
    res.clearCookie("tokenRecoveryCode");
    res.json({message: "password Update"})
   
   
   
  }catch(error){
    console.log("error");
  }
  }
   
   
  export default passwordRecoveryController;
  