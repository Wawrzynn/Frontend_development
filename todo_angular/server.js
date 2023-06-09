// set up ======================================================================
var http = require("http");
var express = require("express");
var app = express(); // create our app w/ express
var mongoose = require("mongoose"); // mongoose for mongodb
var cors = require("cors");

var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var path = require("path");

var port = 4000;

// configuration ===============================================================
mongoose.connect(
  "mongodb+srv://wawrzyn:Lewandowski10@todo-react.ipw6rfk.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
); // connect to mongoDB database on modulus.iox

app.set("port", process.env.PORT || port);
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // set the static files location /public/img will be /img for users

// define model ============================================================================================
var Todo = mongoose.model("Todo", {
  text: String,
  done: Boolean,
});

// routes ==================================================================================================
app.use(cors());

// api ------------------------------------------------------------------------------------------------------
// GET ALL TODOS
app.get("/api/todos", function (req, res) {
  Todo.find(function (err, todos) {
    if (err) res.send(err);
    res.json(todos);
  });
});

// GET SELECTED TODO
app.get("/api/todos/:todo_id", function (req, res) {
  Todo.find(
    {
      _id: req.params.todo_id,
    },
    function (err, todos) {
      if (err) res.send(err);
      if (todos) res.status(200).json(todos);
      else res.status(504);
    }
  );
});

// POST NEW TODO
app.post("/api/todos", function (req, res) {
  Todo.create(
    {
      text: req.body.text,
      done: false,
    },
    function (err, todo) {
      if (err) res.send(err);
      Todo.find(function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
      });
    }
  );
});

// PATCH SELECTED TODO
app.patch("/api/todos/:todo_id", function (req, res) {
  Todo.findByIdAndUpdate(
    req.params.todo_id,
    {
      done: req.body.done,
    },
    function (err) {
      if (err) res.send(err);
      Todo.find(function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
      });
    }
  );
});

// DELETE SELECTED TODO
app.delete("/api/todos/:todo_id", function (req, res) {
  Todo.remove(
    {
      _id: req.params.todo_id,
    },
    function (err, todo) {
      if (err) res.send(err);
      Todo.find(function (err, todos) {
        if (err) res.send(err);
        res.json(todos);
      });
    }
  );
});

// TODO ------------------------------------------------------------------------------------------------------

// GET ALL TODO
app.get("/api/todo", function (req, res) {
  Todo.find(
    {
      done: false,
    },
    function (err, todos) {
      if (err) res.send(err);
      if (todos) res.status(200).json(todos);
      else res.status(504);
    }
  );
});

// PATCH SELECTED TODO
app.patch("/api/todo/:todo_id", function (req, res) {
  Todo.findByIdAndUpdate(
    req.params.todo_id,
    {
      done: req.body.done,
    },
    function (err) {
      if (err) res.send(err);
      Todo.find(
        {
          done: false,
        },
        function (err, todos) {
          if (err) res.send(err);
          res.json(todos);
        }
      );
    }
  );
});

// DELETE SELECTED TODO
app.delete("/api/todo/:todo_id", function (req, res) {
  Todo.remove(
    {
      _id: req.params.todo_id,
    },
    function (err, todo) {
      if (err) res.send(err);
      Todo.find(
        {
          done: false,
        },
        function (err, todos) {
          if (err) res.send(err);
          res.json(todos);
        }
      );
    }
  );
});

// DONE ------------------------------------------------------------------------------------------------------

// GET ALL DONE
app.get("/api/done", function (req, res) {
  Todo.find(
    {
      done: true,
    },
    function (err, todos) {
      if (err) res.send(err);
      if (todos) res.status(200).json(todos);
      else res.status(504);
    }
  );
});

// PATCH SELECTED TODO
app.patch("/api/done/:todo_id", function (req, res) {
  Todo.findByIdAndUpdate(
    req.params.todo_id,
    {
      done: req.body.done,
    },
    function (err) {
      if (err) res.send(err);
      Todo.find(
        {
          done: true,
        },
        function (err, todos) {
          if (err) res.send(err);
          res.json(todos);
        }
      );
    }
  );
});

// DELETE SELECTED TODO
app.delete("/api/done/:todo_id", function (req, res) {
  Todo.remove(
    {
      _id: req.params.todo_id,
    },
    function (err, todo) {
      if (err) res.send(err);
      Todo.find(
        {
          done: true,
        },
        function (err, todos) {
          if (err) res.send(err);
          res.json(todos);
        }
      );
    }
  );
});

// application ------------------------------------------------------------------------------------------------------
app.get("*", function (req, res) {
  res.sendFile("./public/index.html", { root: __dirname });
});

// listen (start app with node server.js) ==========================================================================
var server = http.createServer(app);
server.listen(app.get("port"), function () {
  console.log(
    "Express server listening on: http://localhost:" + app.get("port")
  );
});
