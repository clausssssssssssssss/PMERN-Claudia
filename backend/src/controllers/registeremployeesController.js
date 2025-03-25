//Importamos el modelo de la base de datos
import Employee from "../models/Employee.js";
import bcryptjs from "bcryptjs"; //Lib para incriptar
import jsonwebtoken from "jsonwebtoken"; //Lib.token
import { config } from "../config.js";


//creamos array de funciones
const registeremployeesController = {};

registeremployeesController.register = async (req, res) => {
    //pedimos todos los datos
    const{name, lastName, birthday, email, address, password, hireDate, telephone, dui, isVerified, issnumber}= req.body;

    try{
        //Verificamos que el empleado existe
        const existEmployee =await Employee.findOne({email});
        if(existEmployee){
            return res.json({message : "Employee already exist"});
        }
        //Hashear o incriptar la contraseña
        const passwordHash = await bcryptjs.hash(password, 10);

        //Guardamos el empleado en la bd
        const newEmployee = new Employee({
            name, 
            lastName, 
            birthday, 
            email, 
            address, 
            password: passwordHash, 
            hireDate, 
            telephone, 
            dui, 
            isVerified, 
            issnumber});

            await newEmployee.save(); 

            //Genera un token que que valide que ya estoy registrado
            //y puedo accder a todas las paginas u
            jsonwebtoken.sign(
   //1.Que voy a guardar 
   {id: newEmployee.id},
   //2.Clave secreta
   config.JWT.secret,
   //3.caudno expira
   {expiresIn: config.JWT.expiresIn},
   //4.Funcion flecha
   (error, token) =>{
       if(error) console.log(error);
   res.cookie("authToken", token);
   res.json({message: "registrado"})
   }

            );
         
            


    }
   catch (error){
    console.log(error);
    res.json({message: "Error al registrar empleado"});
}
};

export default registeremployeesController;
