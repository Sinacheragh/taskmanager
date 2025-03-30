// arrow fuction
let myFunction = (a, b) => a * b;

//array method filter
const ages = [32, 33, 16, 40];
const result = ages.filter(checkAdult);

function checkAdult(age) {
  return age >= 18;
}



