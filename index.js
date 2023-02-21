const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname); // Get the extension of the file
    cb(null, 'format'+ extension); // Concatenate the original name with the timestamp and extension
  }
});

const upload = multer({ storage: storage });

app.post('/save-file', upload.single('file-input'), function(req, res) {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  console.log('File uploaded successfully:', req.file.filename);
  res.status(200).send('File uploaded successfully.');
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

async function fixResponse(Instruction, Input) {
  const response = await openai.createEdit({
    model: "text-davinci-edit-001",
    input: Input,
    instruction: Instruction,
  });

  return response.data.choices[0].text;
}

async function generateResponse(input, maxTokens) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: input,
      temperature: 0.6,
      max_tokens: parseInt(maxTokens),
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });
  
    return response.data.choices[0].text;
  }
  
app.post('/generate-next-clause', (req, res) => {
  const mainContract = req.body.main_contract;
  const maxTokens = req.body.max_tokens;
  console.log(maxTokens)
  console.log(mainContract)
  generateResponse(mainContract, maxTokens)
    .then(nextClause => {
      res.send({ main_contract: mainContract, next_clause: nextClause});
      console.log(nextClause)
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ error: 'Something went wrong' });
    });
});

app.post('/edit-clause', (req, res) => {
  const Instruction = req.body.Instruction;
  const Input = req.body.Input;
  console.log(Instruction)
  console.log(Input)
  fixResponse(Instruction, Input)
    .then(nextClause => {
      res.send({ Input: Input, next_clause: nextClause});
      console.log(nextClause)
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ error: 'Something went wrong' });
    });
});

