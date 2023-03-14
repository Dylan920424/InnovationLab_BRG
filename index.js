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

var changes = [];

async function fixResponse(Instruction, Input) {
  const response = await openai.createEdit({
    model: "text-davinci-edit-001",
    input: Input,
    instruction: Instruction,
  });
  changes.push(Instruction)
  return response.data.choices[0].text;
}

async function generateResponse(input) {
    const GPT35TurboMessage = [
      { role: "system", content: `You help lawyers to generate employee agreements` },
      { role: "user", content: input },
    ];  
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: GPT35TurboMessage,
    });
  
    return response.data.choices[0].message.content;
  }
  
app.post('/generate-next-clause', (req, res) => {
  const mainContract = req.body.main_contract;
  console.log(mainContract)
  generateResponse(mainContract)
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
  console.log(changes)
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

