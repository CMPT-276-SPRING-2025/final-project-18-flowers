import { describe, it, expect } from 'vitest';
import { processResponse } from '../components/Model.jsx';

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
    const expectedOutput = inputText.substring(0, 300) + (inputText.length > 300 ? "..." : "");
    const result = processResponse(inputText);
    expect(result).toBe(expectedOutput);
  });
});
