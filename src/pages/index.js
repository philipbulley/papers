import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout';
import SEO from '../components/seo';
import moment from 'moment';
import Slider from '@material-ui/core/Slider';
import _IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import HelpIcon from '@material-ui/icons/Help';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const useThumbnails = process.env.USE_THUMBNAILS === 'true';
const start = moment('1851-09-18').startOf('day');
const end = moment('2020-05-11').startOf('day');
const firstSundayPublication = moment('1861-04-21');
const days = end.diff(start, 'days');

const NewYorkTimes = () => {
  const [cursor, setCursor] = useState(0);
  const day = moment(start).add(cursor, 'days');
  const debounce = useRef(null);
  const [url, setUrl] = useState();
  const [sync, setSync] = useState(true);
  const [imageError, setImageError] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    useThumbnails ? setUrl(getUrl(day, true)) : setSync(false);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setImageError(false);
      setUrl(getUrl(day));
    }, 300);
  }, [cursor]);

  const handleOnLoad = useCallback(() => {
    if (!imageLoaded) {
      setImageLoaded(true);
    }

    if (!useThumbnails) {
      setSync(true);
    }
  }, [imageLoaded, useThumbnails]);

  const handleOnError = useCallback(() => {
    setImageError(true);
    setSync(true);
  }, []);

  const toggleDialog = useCallback(() => {
    setShowDialog(!showDialog);
  }, [showDialog]);

  const dateLabel = day.format('dddd Do MMMM YYYY');

  return (
    <Layout>
      <Container>
        <Main>
          <SEO title="New York Times — Front Pages" />
          {!imageError && (
            <FrontPage>
              <FrontPageImage
                src={url}
                alt={`New York Times front page on ${dateLabel}`}
                onError={handleOnError}
                onLoad={handleOnLoad}
                sync={sync}
                show={imageLoaded}
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
                  paragraph
                  css={{ marginTop: '100px' }}
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
              onChange={(e, newValue) => setCursor(newValue)}
              min={0}
              max={days}
            />
          </SliderContainer>
          <IconButton
            onClick={() => {
              setCursor(cursor - 1);
            }}
            disabled={cursor === 0}
          >
            <NavigateBefore color="primary" />
          </IconButton>
          <IconButton
            onClick={() => setCursor(cursor + 1)}
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

function getUrl(day, thumbnail) {
  const base = thumbnail
    ? `/thumb/nyt/%y/%m/%d.jpg`
    : `https://static01.nyt.com/images/%y/%m/%d/nytfrontpage/scan.jpg`;

  return base
    .replace('%y', day.year())
    .replace('%m', (day.month() + 1).toString().padStart(2, '0'))
    .replace('%d', day.date().toString().padStart(2, '0'));
}

function getImageFallbackText(day) {
  let str = '';
  if (day.weekday() === 0 && day < firstSundayPublication) {
    str +=
      'The New York Times did not publish on Sundays before 21st April 1861. ';
  }
  str +=
    'The New York Times may not have published on this day due to a strike or public holiday. ';
  if (end.diff(day, 'years') < 10) {
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
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
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
  opacity: ${({ sync }) => (sync ? 1 : 0.2)};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
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
