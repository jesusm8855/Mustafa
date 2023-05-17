const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const pool = require("./database.js");

//inicializaciones
const app = express();

//configuraciones
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", 
  exphbs.engine({
  defaultlauout: "main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialDir: path.join(app.get("views"),"partials"),
  extname: ".hbs",
  helpers: require("./lib/handlebars")
}));

app.set("view engine", ".hbs")


//use app
app.use(express.urlencoded({extended: false})); //sirve para traer desde el formulario los datos que dan los usuarios
app.use(express.json());



//public
app.use(express.static(path.join(__dirname, "public")));

//rutas
app.use(require("./routes/"));
app.use("/productos_venta", require("./routes/productos_venta"));
app.use("/productos_bodega", require("./routes/productos_bodega"));
app.use("/productos_traslado", require("./routes/productos_traslado"));


app.listen(app.get("port"),() => {
  console.log('Servidor escuchando en el puerto', app.get("port"));
});