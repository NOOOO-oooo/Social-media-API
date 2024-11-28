const express = require("express");
const app = express();
const port = 2001;
const userRoutes = require("./routes/userRoutes");
const postsRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likesRoutes");
const commentRoutes = require("./routes/commentRoutes");
const friendsRoutes = require("./routes/friendsRoutes");
app.use(express.json());

app.use("/auth", userRoutes);

app.use("/change", userRoutes);

app.use("/posts", postsRoutes);

app.use("/likes", likeRoutes);

app.use("/comments", commentRoutes);

app.use("/friends", friendsRoutes);
app.listen(port, () => {
   console.log(`Listening to port ${port}...`);
});
