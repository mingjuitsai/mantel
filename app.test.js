import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sanitizeLine, getUserEntry, parseLog, sortMapByHigherNumber } from './app';
import fs from 'fs';
import readline from 'readline';

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

describe('parseLog', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('correctly parses log file', async () => {
    const mockLines = [
      '192.168.1.1 - - [26/Apr/2000:00:23:48 -0400] "GET /index.html HTTP/1.0" 200 6248',
      '192.168.1.2 - - [26/Apr/2000:00:23:49 -0400] "GET /about.html HTTP/1.0" 200 6248',
      '192.168.1.1 - - [26/Apr/2000:00:23:50 -0400] "GET /contact.html HTTP/1.0" 200 6248'
    ];

    const mockReadline = {
      on: vi.fn((event, callback) => {
        if (event === 'line') {
          mockLines.forEach(callback);
        }
        if (event === 'close') {
          callback();
        }
      })
    };

    vi.spyOn(readline, 'createInterface').mockReturnValue(mockReadline);
    vi.spyOn(fs, 'createReadStream').mockReturnValue({});

    const result = await parseLog('mockFilePath');

    expect(result.ipAddresses.size).toBe(2);
    expect(result.urlVisits.get('/index.html')).toBe(1);
    expect(result.urlVisits.get('/about.html')).toBe(1);
    expect(result.urlVisits.get('/contact.html')).toBe(1);
    expect(result.ipActivity.get('192.168.1.1')).toBe(2);
    expect(result.ipActivity.get('192.168.1.2')).toBe(1);
  });
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