const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

async function generateResponse(input) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: input,
      temperature: 0.6,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });
  
    return response.data.choices[0].text;
  }
  
app.post('/generate-next-clause', (req, res) => {
  const mainContract = req.body.main_contract;
  generateResponse(mainContract)
    .then(nextClause => {
      res.send({ main_contract: mainContract, next_clause: nextClause });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ error: 'Something went wrong' });
    });
});
  
  