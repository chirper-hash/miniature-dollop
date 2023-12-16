const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 4001, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.get('/webhooks/answer', (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  let conferenceId = req.query.conference_id;

  const ncco = [
    {
      action: 'talk',
      voiceName: 'Jennifer',
      text: 'Welcome to your Nexmo powered conference call, ' + conferenceId.substr(-4)
    },
    {
      action: 'conversation',
      name: conferenceId
    }
  ];

  res.json(ncco);
});

app.post('/webhooks/event', (req, res) => {
  console.log(req.body);
  res.status(204).end();
});