// src/test/unit-test.js
import { processResponse } from '../components/Model.jsx';

function testProcessResponse() {
  const inputText1 = `* Go to the movies
* Visit a museum
* Try a new restaurant`;
  const result1 = processResponse(inputText1);
  if (result1 === inputText1) {
    console.log("Test passed: Bullet points correctly handled");
  } else {
    console.error("Test failed: Bullet points not correctly handled");
    console.error("Expected:", inputText1);
    console.error("Received:", result1);
  }

  const inputText2 = "Explore places to hang out around the city with lots of fun activities. You can visit art galleries, cafes, or parks.";
  const expectedOutput2 = inputText2.substring(0, 300) + (inputText2.length > 300 ? "..." : "");
  const result2 = processResponse(inputText2);
  if (result2 === expectedOutput2) {
    console.log("Test passed: Text truncated correctly");
  } else {
    console.error("Test failed: Text truncation incorrect");
    console.error("Expected:", expectedOutput2);
    console.error("Received:", result2);
  }
}

testProcessResponse();
