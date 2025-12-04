const make = require("fs");
const os = require("os");
console.log(os.cpus().length);
//Sync
//make.writeFileSync("./file1.txt", "this is a file make by7 writefilestync");
//Async
// make.writeFile("./file1.txt", "HI miraj", (e) => {
//   console.log(e);
// });

// const result = make.readFileSync("./contacts.txt", "utf-8");
// console.log(result);

// for updating the file
//make.appendFileSync("./file1.txt", " What do you want\n");

// to delter  use unlink
// to make a function use the mkdirsync
//make.mkdirSync("./Src");
