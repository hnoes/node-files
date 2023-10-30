const fs = require('fs');  // for working with the file system
const process = require('process');  // for accessing command-line arguments and exiting the program
const axios = require('axios');   // for making HTTP requests

/** define 'handleOutput' : write to file if out given, else print */

function handleOutput(text, out) {  
  if (out) {
    fs.writeFile(out, text, 'utf8', function(err) {
      if (err) {
        console.error(`Couldn't write ${out}: ${err}`);
        process.exit(1);
      }
    });
  } else {
    console.log(text);
  }
}

/** read file at path and print it out. */
// 'cat' reads the contents of a file at a specified path 
function cat(path, out) {
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) {
      console.error(`Error reading ${path}: ${err}`);
      process.exit(1);
    } else {
      handleOutput(data, out);  // uses handleOutput to display the response data
    }
  });
}

/** read page at URL and print it out. */
// makes an HTTP request to a URL and uses 'handleOutput' to display the response data

async function webCat(url, out) {
  try {
    let resp = await axios.get(url);
    handleOutput(resp.data, out);
  } catch (err) {
    console.error(`Error fetching ${url}: ${err}`);
    process.exit(1);
  }
}

let path;
let out;

if (process.argv[2] === '--out') {
  out = process.argv[3];
  path = process.argv[4];
} else {
  path = process.argv[2];
}

if (path.slice(0, 4) === 'http') {
  webCat(path, out);
} else {
  cat(path, out);
}


