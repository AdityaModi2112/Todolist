import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "hello",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try{
  const result= await db.query("SELECT * FROM item ORDER BY id ASC;");
  items=result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
}catch(err){
  console.log(err);
}
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  //items.push({ title: item });
  try{
    const result= db.query("INSERT INTO item(title) VALUES($1);",[item]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/edit", (req, res) => {
  const input=req.body.updatedItemTitle;
  const id=req.body.updatedItemId;
  try{
  const result = db.query("UPDATE item SET title=$1 WHERE id=$2;",[input,id]);
  res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/delete", (req, res) => {
  const input=req.body.deleteItemId;
  try{
    const result=db.query("DELETE FROM item WHERE id=$1;",[input]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
