import { writeFile } from "fs/promises";
import path from "path/posix";

async function otcsv(object, path) {

    let keys = Object.keys(object);
    let headings = Object.keys(object[keys[0]]);
    let values = (k) => Object.values(object[k]);

let data = `
                    ${headings.map(h => h).join(`               `)}
${keys.map(k => `${k}         ${values(k).map(v => (v * 100 / 60).toFixed(2)).join(`                              `)}`).join(`\n`)}   
`

writeFile(path, data, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
  });

  return path;

};

export default otcsv;