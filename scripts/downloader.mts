import axios from 'axios';
import * as Path from 'path';
import * as fs from 'fs';
import { promises as fsp } from 'fs';
import {
  addDays,
  differenceInCalendarDays,
  format,
  isBefore,
  isSunday,
  parseISO,
  startOfToday,
} from 'date-fns';
import sharp from 'sharp';

// download(
//   'https://static01.nyt.com/images/2006/06/10/nytfrontpage/scannat.jpg',
//   '2006-06-10.jpg'
// );

///////////
const basePath = Path.resolve(import.meta.dirname, '..', 'download', 'nyt');
const latestFile = `${basePath}/latest.txt`;
const failsFile = `${basePath}/fails.txt`;

console.log('Base Path:', basePath);

const start = new Date(1851, 8, 18);
const end = startOfToday();
const totalDays = differenceInCalendarDays(end, start);
const firstSundayPublication = new Date(1861, 3, 21);
let sessionStart: Date | undefined;
let day: Date;

/** Download a single file and write to disk
 *
 * @param url
 * @param filename
 */
async function download(url: string, path: string, filename = 'dummy.jpg') {
  const fullPath = basePath + path;
  await fsp.mkdir(fullPath, { recursive: true });
  const file = `${fullPath}/${filename}`;
  const writer = fs.createWriteStream(file);

  // console.debug(`GET ${url}`);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10 * 1000,
    });
    response.data.pipe(writer);
  } catch (e) {
    fsp.unlink(file);
    throw new Error((e as Error).message);
  }

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', () => {
      fsp.unlink(file);
      reject();
    });
  });
}

async function downloadDay(day: Date) {
  const url = getUrl(day);
  const filename = format(day, 'dd') + '.jpg';

  return download(url, `/full/${format(day, 'yyyy/MM')}`, filename);
}

async function resizeDay(day: Date, size: number) {
  const filename = format(day, 'dd') + '.jpg';
  const fromPath = `/full/${format(day, 'yyyy/MM')}`;
  const toPath = `/thumb/${size}/${format(day, 'yyyy/MM')}`;

  // console.log('Resize', `${basePath}${fromPath}/${filename}`);

  await fsp.mkdir(`${basePath}${toPath}`, { recursive: true });

  return sharp(`${basePath}${fromPath}/${filename}`)
    .resize(size)
    .toFile(`${basePath}${toPath}/${filename}`);
}

async function downloadNext() {
  if (!sessionStart) {
    const latestSuccess = await fsp.readFile(latestFile, { encoding: 'ascii' });
    if (latestSuccess) {
      sessionStart = addDays(parseISO(latestSuccess), 1);
      console.log('Resuming at', format(sessionStart, 'yyyy-MM-dd'));
    } else {
      sessionStart = start;
      console.log(
        'Starting from the beginning at',
        format(sessionStart, 'yyyy-MM-dd'),
      );
    }
    day = sessionStart;
  } else {
    day = addDays(day, 1);
  }

  if (isSunday(day) && isBefore(day, firstSundayPublication)) {
    console.log(`🏃🏽‍♀️ Skipped ${format(day, 'yyyy-MM-dd EEEE')}`);
    day = addDays(day, 1);
  }

  const dayFormatted = format(day, 'yyyy-MM-dd');
  try {
    await downloadDay(day);
    await resizeDay(day, 100);
    await resizeDay(day, 75);
    await resizeDay(day, 50);
    await resizeDay(day, 37);
    await resizeDay(day, 25);

    fsp.writeFile(latestFile, dayFormatted);
    const complete = differenceInCalendarDays(day, start);
    const todo = differenceInCalendarDays(end, day);

    console.log(
      `✅ ${dayFormatted}\t${format(day, 'EEE')}\t${complete}\t${todo}\t${totalDays}\t${
        Math.ceil((complete / totalDays) * 100 * 100) / 100
      }%`,
    );
  } catch (e) {
    await fsp.appendFile(failsFile, `${dayFormatted}\n`);
    console.error(`❌ Failed to download ${dayFormatted}`, e);
  } finally {
    downloadNext();
  }
}

function getUrl(day: Date) {
  return `https://static01.nyt.com/images/${format(day, 'yyyy/MM/dd')}/nytfrontpage/scan.jpg`;
}

////////////

downloadNext();

// https://static01.nyt.com/images/2011/01/01/nytfrontpage/scannat.jpg
// https://static01.nyt.com/images/1859/09/18/nytfrontpage/scan.jpg
// https://static01.nyt.com/images/1851/09/18/nytfrontpage/scan.jpg
// https://static01.nyt.com/images/1991/05/23/nytfrontpage/scan.jpg
