// Import necessary modules
import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";
import spazaSuggest from "./spaza-suggest.js";
import db from "./connection/dbconnect.js";
import routes from "./routes/routes.js";

const app = express();
const spaza = spazaSuggest(db);
const route = routes(spaza);

// Set up Handlebars as the view engine
app.engine(
  "handlebars",
  engine({
    layoutsDir: "./views/layouts",
  })
);

app.set("view engine", "handlebars");
app.set("views", "./views");

// Set up static files and body parsing middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up session middleware
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "Asiphe's",
  })
);

// Set up flash messages middleware
app.use(flash());

// Define routes
app.get("/", (req, res) => {
  // Handle root route
  res.send("Welcome to the Spaza Suggest App  please register first");
});

// New Client Registration
app.get("/register", route.register);
app.post("/register", route.register);

// Client Login
app.get("/login", route.login);
app.post("/login", route.login);

// Client Make Product Suggestion
app.post("/suggest", route.suggest);

// Client View Suggestions
app.get("/client-suggestions", route.clientSuggestion);

// Spaza Shop Registration
app.post("/spaza-register", route.spazaRegister);

// Spaza Shop Login
app.post("/spaza-login", route.spazaLogin);

// Spaza Shop View Suggestions
app.get("/shop-suggestions", route.shopSuggestions);

// Spaza Shop Accept Suggestion
app.post("/accept-suggestion", route.acceptSuggestions);

// Spaza Shop View Accepted Suggestions
app.get("/shop-accepted-suggestions", route.acceptedSuggestions);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
