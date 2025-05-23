// Importo todo lo de la libreria de Express
import express from "express";
import productsRoutes from "./src/routes/products.js";
import customersRoutes from "./src/routes/customers.js";
import employeeRoutes from "./src/routes/employees.js";
import branchesRoutes from "./src/routes/branches.js";
import reviewsRoutes from "./src/routes/reviews.js";
import evaluationsRoutes from "./src/routes/evaluations.js"
import registeremployeesRoutes from "./src/routes/registeremployees.js"
import registerclientsRoutes from "./src/routes/registerclients.js"
import loginRoutes from "./src/routes/login.js"
import logoutRoutes from "./src/routes/logout.js"
import cookieParser from "cookie-parser";
import emailPasswordRecovery from "./src/utils/emailPasswordRecovery.js"

// Creo una constante que es igual a la libreria que importé
const app = express();

//Que acepte datos en json
app.use(express.json());
//Que acepte cookies
app.use(cookieParser());

// Definir las rutas de las funciones que tendrá la página web
c
app.use("/api/customers", customersRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/evaluations", evaluationsRoutes);
app.use("/api/registerEmployes", registeremployeesRoutes);
//Login
app.use("/api/login", loginRoutes );
app.use("/api/logout", logoutRoutes);

app.use("/api/registerClients", registerclientsRoutes)
app.use("/api/emailPasswordRecovery", emailPasswordRecovery)

// Exporto la constante para poder usar express en otros archivos
export default app;
n