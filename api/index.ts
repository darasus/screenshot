import {getScreenshot} from './_lib/puppeteer';

module.exports = async (req, res) => {
  if (!req.query.url) {
    return res.status(400).send('No url query specified.');
  }

  if (!checkUrl(req.query.url)) {
    return res.status(400).send('Invalid url query specified.');
  }

  try {
    const file = await getScreenshot(
      req.query.url,
      req.query.width,
      req.query.height
    );
    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Cache-Control',
      `s-maxage=10, stale-while-revalidate=${10 * 60 * 1000}`
    );
    res.status(200).end(file);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        'The server encountered an error. You may have inputted an invalid query.'
      );
  }
};

function checkUrl(string) {
  try {
    new URL(string).toString();
  } catch (error) {
    return false;
  }
  return true;
}
