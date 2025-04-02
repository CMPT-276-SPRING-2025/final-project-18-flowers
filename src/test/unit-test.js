import { processResponse } from '../components/Model.js';


// Unit Test 1: Testing processResponse function
function testProcessResponse() {
  const inputText1 = `* Go to the movies\n* Visit a museum\n* Try a new restaurant`;
  const result1 = processResponse(inputText1);
  if (result1 === "* Go to the movies\n* Visit a museum\n* Try a new restaurant") {
    console.log("Test passed: Bullet points correctly handled");
  } else {
    console.log("Test failed: Bullet points not correctly handled");
  }

  const inputText2 = "Explore places to hang out around the city with lots of fun activities. You can visit art galleries, cafes, or parks.";
  const result2 = processResponse(inputText2);
  if (result2 === "Explore places to hang out around the city with lots of fun activities. You can visit art galleries...") {
    console.log("Test passed: Text truncated correctly");
  } else {
    console.log("Test failed: Text truncation incorrect");
  }
}


testProcessResponse();
