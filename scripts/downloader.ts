import axios from 'axios';
import * as Path from 'path';
import * as fs from 'fs';
import { promises as fsp } from 'fs';
import moment from 'moment';
import mkdirp from 'mkdirp';
import sharp from 'sharp';

// download(
//   'https://static01.nyt.com/images/2006/06/10/nytfrontpage/scannat.jpg',
//   '2006-06-10.jpg'
// );

///////////
const basePath = Path.resolve(__dirname, '..', 'download', 'nyt');
const latestFile = `${basePath}/latest.txt`;
const failsFile = `${basePath}/fails.txt`;

console.log('Base Path:', basePath);

const start = moment('1851-09-18').startOf('day');
const end = moment().startOf('day');
const totalDays = end.diff(start, 'days');
const firstSundayPublication = moment('1861-04-21');
let sessionStart;
// const days = end.diff(start, 'days') + 1;
let day;

/** Download a single file and write to disk
 *
 * @param url
 * @param filename
 */
async function download(url, path, filename = 'dummy.jpg') {
  const fullPath = basePath + path;
  // @ts-ignore
  await mkdirp(fullPath);
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
    throw new Error(e.message);
  }

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', () => {
      fsp.unlink(file);
      reject();
    });
  });
}

async function downloadDay(day) {
  const url = getUrl(day);
  const filename = day.format('DD') + '.jpg';

  return download(url, `/full/${day.format('YYYY/MM')}`, filename);
}

async function resizeDay(day, size) {
  const filename = day.format('DD') + '.jpg';
  const fromPath = `/full/${day.format('YYYY/MM')}`;
  const toPath = `/thumb/${size}/${day.format('YYYY/MM')}`;

  // console.log('Resize', `${basePath}${fromPath}/${filename}`);

  // @ts-ignore
  await mkdirp(`${basePath}${toPath}`);

  return sharp(`${basePath}${fromPath}/${filename}`)
    .resize(size)
    .toFile(`${basePath}${toPath}/${filename}`);
}

async function downloadNext() {
  if (!sessionStart) {
    const latestSuccess = await fsp.readFile(latestFile, { encoding: 'ascii' });
    if (latestSuccess) {
      sessionStart = moment(latestSuccess).add(1, 'days');
      console.log('Resuming at', sessionStart.format('YYYY-MM-DD'));
    } else {
      sessionStart = start.clone();
      console.log(
        'Starting from the beginning at',
        sessionStart.format('YYYY-MM-DD')
      );
    }
    day = sessionStart.clone();
  } else {
    day.add(1, 'days');
  }

  if (day.weekday() === 0 && day < firstSundayPublication) {
    console.log(`🏃🏽‍♀️ Skipped ${day.format('YYYY-MM-DD dddd')}`);
    day.add(1, 'days');
  }

  const dayFormatted = day.format('YYYY-MM-DD');
  try {
    await downloadDay(day);
    await resizeDay(day, 100);
    await resizeDay(day, 75);
    await resizeDay(day, 50);
    await resizeDay(day, 37);
    await resizeDay(day, 25);

    fsp.writeFile(latestFile, dayFormatted);
    const complete = day.diff(start, 'days');
    const todo = end.diff(day, 'days');

    console.log(
      `✅ ${dayFormatted}\t${day.format(
        'ddd'
      )}\t${complete}\t${todo}\t${totalDays}\t${
        Math.ceil((complete / totalDays) * 100 * 100) / 100
      }%`
    );
  } catch (e) {
    await fsp.appendFile(failsFile, `${dayFormatted}\n`);
    console.error(`❌ Failed to download ${dayFormatted}`, e);
  } finally {
    downloadNext();
  }
}

function getUrl(day) {
  return `https://static01.nyt.com/images/${day.year()}/${(day.month() + 1)
    .toString()
    .padStart(2, '0')}/${day
    .date()
    .toString()
    .padStart(2, '0')}/nytfrontpage/scan.jpg`;
}

////////////

downloadNext();

// https://static01.nyt.com/images/2011/01/01/nytfrontpage/scannat.jpg
// https://static01.nyt.com/images/1859/09/18/nytfrontpage/scan.jpg
// https://static01.nyt.com/images/1851/09/18/nytfrontpage/scan.jpg
// https://static01.nyt.com/images/1991/05/23/nytfrontpage/scan.jpg
