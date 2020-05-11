import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import Layout from '../components/layout';
import SEO from '../components/seo';
import moment from 'moment';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const start = moment('1851-09-18').startOf('day');
const end = moment('2020-05-11').startOf('day');
const firstSundayPublication = moment('1861-04-21');
const days = end.diff(start, 'days');

const NewYorkTimes = () => {
  const [cursor, setCursor] = useState(1);
  const day = moment(start).add(cursor, 'days');
  const debounce = useRef(null);
  const [url, setUrl] = useState(getUrl(day));
  const [imageError, setImageError] = useState();

  useEffect(() => {
    setImageError(false);
    setUrl(getUrl(day, true));
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setUrl(getUrl(day)), 300);
  }, [cursor]);

  const update = _cursor => {
    setCursor(_cursor);
    console.log('call update', day);
  };

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
                onError={setImageError}
              />
            </FrontPage>
          )}
          {imageError && (
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
          <DateLabel>
            <div>{dateLabel}</div>
          </DateLabel>
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
              update(cursor - 1);
            }}
            disabled={cursor === 0}
          >
            <NavigateBefore color="primary" />
          </IconButton>
          <IconButton
            onClick={() => update(cursor + 1)}
            disabled={cursor + 1 > days}
          >
            <NavigateNext color="primary" />
          </IconButton>
        </Controls>
      </Container>
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

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 50px;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
`;

const Main = styled(Paper)`
  text-align: center;
`;

const FrontPage = styled(Paper)`
  display: inline-block;
  height: 98%;
  margin: 5px auto;
`;

const FrontPageImage = styled.img`
  height: 100%;
`;

const FrontPageFallback = styled.div`
  height: 100%;
  margin: 0 auto;
  background-color: #fefffe;
  color: #111;
  width: 65vh;
  padding: 30px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  background-color: ${({ theme }) => theme.palette.secondary.main};
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

const DateLabel = styled.div`
  position: absolute;
  font-size: 14px;
  left: 100%;
  top: 70px;

  div {
    transform: rotate(90deg);
    color: #fafafa;
    transform-origin: left top;
    background-color: firebrick;
    white-space: nowrap;
    padding: 10px 20px;
  }
`;
