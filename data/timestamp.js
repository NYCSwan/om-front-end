// load file
// read line
// if timestamp, convert to dateNum
// else return line
const data = require('./data2.json');

function convertDateTime(file) {
  const dataArray = [];
  dataArray.push(file);
  const obj = new RegExp('2018-02-\d\d \d\d:\d\d:\d\d.\d\d\d\d\d\d');
  // forIn(file, function(key, val, obj){

  })
  for( var key in file) {
    // dataArray.map(datum => {
      if(file[key] == obj){
        const temp = datum[key]
        datum[obj] = new Date(key).getTime();
        return datum
      }
    })
}


convertDateTime(data);
