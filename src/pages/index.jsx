import { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import {
  addDays,
  differenceInCalendarDays,
  differenceInYears,
  format,
  isBefore,
  isSameDay,
  isSunday,
} from 'date-fns';
import Slider from '@mui/material/Slider';
import _IconButton from '@mui/material/IconButton';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import HelpIcon from '@mui/icons-material/Help';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const useThumbnails = import.meta.env.VITE_USE_THUMBNAILS === 'true';
const start = new Date(1851, 8, 18);
// Editions are dated by New York's calendar, which may lag the visitor's
const end = getNewYorkToday();
const firstSundayPublication = new Date(1861, 3, 21);
const days = differenceInCalendarDays(end, start);
// If the latest front page isn't published yet when the site opens, step
// back at most this many days to find one
const maxLandingStepsBack = 2;

const NewYorkTimes = () => {
  // A date in the URL (e.g. /1851/09/18) opens on that day, otherwise
  // open on the latest front page
  const [cursor, setCursor] = useState(
    () => getCursorFromPath(window.location.pathname) ?? days,
  );
  const day = addDays(start, cursor);
  const debounce = useRef(null);
  const [url, setUrl] = useState();
  const [sync, setSync] = useState(true);
  const [imageError, setImageError] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  // True until the first front page loads or the visitor navigates. Only
  // applies when opening the latest front page, not a date from the URL
  const isLanding = useRef(cursor === days);
  const landingStepsBack = useRef(0);
  // The day shown for "/", which may have stepped back from today
  const landingCursor = useRef(days);
  // Whether the next settled day should be added to browser history
  const pushToHistory = useRef(false);

  const navigateTo = useCallback(newCursor => {
    isLanding.current = false;
    pushToHistory.current = true;
    setCursor(newCursor);
  }, []);

  useEffect(() => {
    // Drop an unrecognised or out of range date from the URL
    if (
      window.location.pathname !== '/' &&
      getCursorFromPath(window.location.pathname) === null
    ) {
      window.history.replaceState(null, '', '/');
    }

    // Back and forward buttons
    const handlePopState = () => {
      isLanding.current = false;
      pushToHistory.current = false;
      setCursor(
        getCursorFromPath(window.location.pathname) ?? landingCursor.current,
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    useThumbnails ? setUrl(getUrl(day, true)) : setSync(false);
    document.title = `New York Times, ${format(day, 'd MMMM yyyy')} | Papers Time Machine`;
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setImageError(false);
      setUrl(getUrl(day));

      // Add to history once the visitor settles on a day, so dragging the
      // slider doesn't add every day it passes
      const path = getPath(day);
      if (pushToHistory.current && path !== window.location.pathname) {
        window.history.pushState(null, '', path);
      }
      pushToHistory.current = false;
    }, 300);
  }, [cursor]);

  const handleOnLoad = useCallback(() => {
    isLanding.current = false;

    if (!imageLoaded) {
      setImageLoaded(true);
    }

    if (!useThumbnails) {
      setSync(true);
    }
  }, [imageLoaded, useThumbnails]);

  const handleOnError = useCallback(() => {
    if (isLanding.current && landingStepsBack.current < maxLandingStepsBack) {
      landingStepsBack.current++;
      landingCursor.current--;
      setCursor(landingCursor.current);
      return;
    }

    isLanding.current = false;
    setImageError(true);
    setSync(true);
  }, []);

  const toggleDialog = useCallback(() => {
    setShowDialog(!showDialog);
  }, [showDialog]);

  const dateLabel = format(day, 'EEEE do MMMM yyyy');

  return (
    <Layout>
      <Container>
        <Main>
          {!imageError && (
            <FrontPage>
              <FrontPageImage
                src={url}
                alt={`New York Times front page on ${dateLabel}`}
                onError={handleOnError}
                onLoad={handleOnLoad}
                $sync={sync}
                $show={imageLoaded}
              />
            </FrontPage>
          )}
          {imageError && sync && (
            <FrontPage>
              <FrontPageFallback>
                <Typography variant="h4" align="center" gutterBottom>
                  {dateLabel}
                </Typography>
                <Typography
                  align="center"
                  sx={{ marginTop: '100px', marginBottom: 2 }}
                >
                  {getImageFallbackText(day)}
                </Typography>
              </FrontPageFallback>
            </FrontPage>
          )}
          <SideBar>
            <div>
              <DateLabel>{dateLabel}</DateLabel>
              <IconButton onClick={toggleDialog}>
                <HelpIcon />
              </IconButton>
            </div>
          </SideBar>
        </Main>
        <Controls>
          <Label htmlFor="time">
            <Typography color="textPrimary" variant="inherit">
              Time Travel
            </Typography>
          </Label>
          <SliderContainer>
            <Slider
              name="time"
              value={cursor}
              onChange={(e, newValue) => navigateTo(newValue)}
              min={0}
              max={days}
            />
          </SliderContainer>
          <IconButton
            onClick={() => {
              navigateTo(cursor - 1);
            }}
            disabled={cursor === 0}
          >
            <NavigateBefore color="primary" />
          </IconButton>
          <IconButton
            onClick={() => navigateTo(cursor + 1)}
            disabled={cursor + 1 > days}
          >
            <NavigateNext color="primary" />
          </IconButton>
        </Controls>
      </Container>
      <Dialog open={showDialog} onClose={toggleDialog}>
        <DialogTitle id="simple-dialog-title">
          🗞 Papers Time Machine
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Papers Time Machine is a small yet neat little time machine of
            newspaper front pages. It's just for fun and not-for-profit.
          </DialogContentText>
          <DialogContentText>
            Papers, does not host any content itself, it simply links to content
            already available on the web. Papers is not responsible for the
            content of the front pages. Anyone seeking permission to use or
            reproduce the front page of a newspaper featured must contact the
            newspaper’s publisher directly.
          </DialogContentText>
          <DialogContentText>
            Happy paper time travelling! 👋⏰
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NewYorkTimes;

function getNewYorkToday() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
      .formatToParts(new Date())
      .map(({ type, value }) => [type, Number(value)]),
  );

  return new Date(parts.year, parts.month - 1, parts.day);
}

function getPath(day) {
  return `/${format(day, 'yyyy/MM/dd')}`;
}

function getCursorFromPath(pathname) {
  const match = pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/?$/);
  if (!match) {
    return null;
  }

  const [year, month, date] = match.slice(1).map(Number);
  const day = new Date(year, month - 1, date);
  // Reject dates that roll over, e.g. 1900/02/30
  if (day.getMonth() !== month - 1 || day.getDate() !== date) {
    return null;
  }

  const cursor = differenceInCalendarDays(day, start);
  return cursor >= 0 && cursor <= days ? cursor : null;
}

function getUrl(day, thumbnail) {
  const path = format(day, 'yyyy/MM/dd');

  return thumbnail
    ? `/thumb/nyt/${path}.jpg`
    : `https://static01.nyt.com/images/${path}/nytfrontpage/scan.jpg`;
}

function getImageFallbackText(day) {
  let str = '';
  if (isSunday(day) && isBefore(day, firstSundayPublication)) {
    return 'The New York Times did not publish on Sundays before 21st April 1861.';
  }

  if (isSameDay(day, end)) {
    return 'This edition is not yet available, please check back later.';
  }
  str +=
    'The New York Times may not have published on this day due to a strike or public holiday. ';
  if (differenceInYears(end, day) < 10) {
    str += `It's also possible that this edition is simply missing from the archive. `;
  }
  return str;
}

const IconButton = styled(_IconButton)`
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 50px;
  height: 100vh;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    Fira Sans,
    Droid Sans,
    Helvetica Neue,
    sans-serif;
`;

const Main = styled(Paper)`
  text-align: center;
  transition: background-color 300ms;
`;

const FrontPage = styled(Paper)`
  display: inline-block;
  height: 98%;
  margin: 5px auto;
`;

const FrontPageImage = styled.img`
  height: 100%;
  opacity: ${({ $sync }) => ($sync ? 1 : 0.2)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transition: opacity 500ms;
`;

const FrontPageFallback = styled.div`
  height: 100%;
  margin: 0 auto;
  background-color: #fefffe6b;
  color: #111;
  width: 65vh;
  padding: 30px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  transition: background-color 300ms;
`;

const Label = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  margin: 0 20px;
  white-space: nowrap;
`;

const SliderContainer = styled.div`
  width: 100%;
  margin: 0 30px 0 15px;
`;

const SideBar = styled.div`
  position: absolute;
  font-size: 14px;
  left: 100%;
  top: 70px;

  > div {
    display: flex;
    transform: rotate(90deg);
    transform-origin: left top;
    white-space: nowrap;
  }

  ${IconButton} {
    color: firebrick;
  }
`;

const DateLabel = styled.div`
  display: flex;
  align-items: center;
  background-color: firebrick;
  color: #fafafa;
  padding: 10px 20px;
  white-space: nowrap;
`;
