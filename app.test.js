import { describe, it, expect, vi } from 'vitest';
import { Readable } from 'stream';
import { sanitizeLine, getUserEntry, parseLogStream, sortMapByHigherNumber } from './app';


vi.mock('fs');
vi.mock('readline');

describe('sanitizeLine', () => {
  it('removes null bytes and trims whitespace', () => {
    const input = ' \0Hello\0 World\0 ';
    const expected = 'Hello World';
    expect(sanitizeLine(input)).toBe(expected);
  });
});

describe('getUserEntry', () => {
  it('returns IP and path for valid log entry', () => {
    const validLine = '192.168.1.1 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"';
    const expected = {
      ip: '192.168.1.1',
      path: '/pics/wpaper.gif'
    };
    expect(getUserEntry(validLine)).toEqual(expected);
  });

  it('returns null for invalid log entry', () => {
    const invalidLine = 'Invalid log entry';
    expect(getUserEntry(invalidLine)).toBeNull();
  });
});

describe('parseLogStream', () => {
    it('correctly parses valid log entries', async () => {
      const mockData = [
        '192.168.1.1 - - [26/Apr/2000:00:23:48 -0400] "GET /pics/wpaper.gif HTTP/1.0" 200 6248 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"',
        '192.168.1.2 - - [26/Apr/2000:00:23:49 -0400] "GET /index.html HTTP/1.0" 200 7352 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"',
        '192.168.1.1 - - [26/Apr/2000:00:23:50 -0400] "GET /pics/5star2000.gif HTTP/1.0" 200 4005 "http://www.jafsoft.com/asctortf/" "Mozilla/4.05 (Macintosh; I; PPC)"'
      ];

      const mockReadable = Readable.from(mockData.join('\n'));

      const result = await parseLogStream(mockReadable);

      console.log(result);

      expect(result.ipAddresses.size).toBe(2);
      expect(result.urlVisits.get('/pics/wpaper.gif')).toBe(1);
      expect(result.urlVisits.get('/index.html')).toBe(1);
      expect(result.urlVisits.get('/pics/5star2000.gif')).toBe(1);
      expect(result.ipActivity.get('192.168.1.1')).toBe(2);
      expect(result.ipActivity.get('192.168.1.2')).toBe(1);
    });

    it('handles empty stream', async () => {
      const mockReadable = Readable.from([]);

      const result = await parseLogStream(mockReadable);

      expect(result.ipAddresses.size).toBe(0);
      expect(result.urlVisits.size).toBe(0);
      expect(result.ipActivity.size).toBe(0);
    });

    // Add more tests for parseLogStream as needed
  });

describe('sortMapByHigherNumber', () => {
  it('sorts map by higher number and limits results', () => {
    const input = new Map([
      ['a', 3],
      ['b', 1],
      ['c', 4],
      ['d', 2]
    ]);
    const expected = [['c', 4], ['a', 3]];
    expect(sortMapByHigherNumber(input, 2)).toEqual(expected);
  });
});