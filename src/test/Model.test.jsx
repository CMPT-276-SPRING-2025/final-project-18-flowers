import { describe, it, expect } from 'vitest';
import { processResponse, generateContent } from '../components/Model.jsx';



describe('processResponse function', () => {
 it('should correctly handle bullet points', () => {
   const inputText = `* Go to the movies
* Visit a museum
* Try a new restaurant`;
   const result = processResponse(inputText);
   expect(result).toBe(inputText);
 });


 it('should truncate text without bullet points', () => {
   const inputText = "Explore places to hang out around the city with lots of fun activities. You can visit art galleries, cafes, or parks.";
   const expectedOutput = inputText.substring(0, 300) + ((inputText.length > 300 && "...") || "");


   const result = processResponse(inputText);
   expect(result).toBe(expectedOutput);
 });
});


describe('generateContent function', () => {
 it('should return return a valid answer given input', async () => {
   const input = "Fun activities at night";
   const output = generateContent(input);


   // checks if output is defined
   expect(output).not.toBe(undefined);
   // checks if output is not an empty string
   expect(output).not.toBe("");
 });
});




