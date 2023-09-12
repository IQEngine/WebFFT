const fs = require("fs");

// Get command line arguments
let filename = process.argv[2];
let oldString = process.argv[3];
let newString = process.argv[4];

fs.readFile(filename, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  let result = data.replace(new RegExp(oldString, "g"), newString);

  fs.writeFile(filename, result, "utf8", function (err) {
    if (err) return console.log(err);
  });
});
