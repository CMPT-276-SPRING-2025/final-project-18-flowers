
import { describe, it, expect } from 'vitest';
import { computeTopPlaces, fetchTicketmasterEvents } from '../pages/Plan.jsx';

describe('testComputeTopPlaces', () => {
    it('should return the 3 top places based on the count', () => {
      const events = [
        {_embedded: {venues: [{ name: "Place X" }],},},
        { _embedded: {venues: [{ name: "Place X" }],},},
        {_embedded: {venues: [{ name: "Place Y" }],},},
        {_embedded: {venues: [{ name: "Place Z" }],},},
        {_embedded: {venues: [{ name: "Place Z" }],},},
        {_embedded: {venues: [{ name: "Place Z" }],},},
      ];

      const result = computeTopPlaces(events);
      expect(result).toEqual([
        {venueName: "Place Z", event: events[4], count: 3 },
        {venueName: "Place X", event: events[0], count: 2 },
        {venueName: "Place Y", event: events[2], count: 1 },
      ]);
    });
      it('should return an empty array when 0 places given', () => {
        const events = [];
        const result = computeTopPlaces(events);
        expect(result).toEqual([]);
    });
});


describe('fetchTicketmasterEvents', () => {
    it('should fetch events based on query and location', async () => {
      const query = 'Park';
      const location = 'Vancouver';

      // Make a request to the Ticketmaster API
      const events = await fetchTicketmasterEvents(query, location);

      // Check if the response returns an events array
      expect(events).toBeInstanceOf(Array);
      });
    });

    it('should handle empty responses when no events match', async () => {
      const query = 'fakeeventhatdoesnotexists';
      const location = 'Mercury';

      const events = await fetchTicketmasterEvents(query, location);
      // checks if empty array is returned with matching null event
      expect(events).toEqual([]);
    });

    it('should return events without errors for valid inputs', async () => {
      const query = 'theater';
      const location = 'Los Angeles';

      const events = await fetchTicketmasterEvents(query, location);

      expect(events).toBeInstanceOf(Array);
      
    });
