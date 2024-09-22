const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 8000;

// Setup multer for file uploads
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit file size to 10 MB
});

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

app.post('/bfhl', upload.single('file'), (req, res) => {
  const { data } = req.body;
  
  // Parse the `data` field (it should be a JSON string)
  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch (error) {
    return res.status(400).json({ is_success: false, error: 'Invalid JSON input format' });
  }

  if (!Array.isArray(parsedData.data)) {
    return res.status(400).json({ is_success: false, error: 'Invalid input format' });
  }

  // Process numbers and alphabets
  const numbers = parsedData.data.filter(item => !isNaN(item));
  const alphabets = parsedData.data.filter(item => /^[a-zA-Z]$/.test(item));
  
  // Extract lowercase alphabets only
  const lowercaseAlphabets = alphabets.filter(item => /^[a-z]$/.test(item));
  
  // Find the highest lowercase alphabet (if exists)
  const highestLowercaseAlphabet = lowercaseAlphabets.length 
    ? [lowercaseAlphabets.sort((a, b) => a.localeCompare(b))[lowercaseAlphabets.length - 1]] 
    : [];

  // Process file data
  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKb = null;

  if (req.file) {
    fileValid = true;
    fileMimeType = req.file.mimetype;       // Get MIME type from multer
    fileSizeKb = (req.file.size / 1024).toFixed(2); // Calculate file size in KB
  } else {
    fileValid = false;
  }

  res.json({
    is_success: true,
    user_id: 'sobin_johnson_28092003',  // Replace with actual user_id
    email: 'sk9903@srmist.edu.in',         // Replace with actual email
    roll_number: 'RA2111003010137',        // Replace with actual roll number
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet[0],
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKb
  });
});

app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
