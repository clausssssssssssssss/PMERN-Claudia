const logoutController = {};

logoutController.logout = async (req,res) => {
    res.clearCookie("authtoken")

    return res.json({ message: "Se cerro sesion"});
};

export default logoutController