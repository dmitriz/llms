/**
 * Generic curried callback-based function to interact with the Google AI API.
 * 
 * @param {string} apiKey - Your Google AI API key.
 * @param {string} endpoint - The specific API endpoint (e.g., 'generateContent', 'countTokens').
 * @returns {Function} A curried function with the signature: f(params)(onResult, onError)
 */
const googleAiApi = (apiKey, endpoint) => (params) => (onResult, onError) => {
  const model = params.model; //  Assumes model is specified in the params
  if (!model) {
    onError(new Error("Model name is required in params."));
    return;
  }
  
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params.requestBody), // Assumes the actual request payload is in params.requestBody
  };
  
  fetch(apiUrl, requestOptions)
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => onResult(data))
    .catch((error) => onError(error));
};

/**
 * Higher-order function to create specific API method functions.
 * 
 * @param {string} apiKey - Your Google AI API key.
 * @returns {object} An object containing curried functions for each API method.
 */
const createGoogleAiApiMethods = (apiKey) => {
  const apiMethods = {};
  const methods = [
    "generateContent",
    "streamGenerateContent",
    "countTokens",
    "embedContent",
    "batchEmbedContents"
  ]; //  You can add or remove methods here based on your needs

  methods.forEach((method) => {
    apiMethods[method] = googleAiApi(apiKey, method);
  });

  return apiMethods;
};

// Example Usage:
const myApiKey = 'YOUR_API_KEY'; // Replace with your actual API key
const api = createGoogleAiApiMethods(myApiKey);

// Using generateContent:
const generateContentParams = {
  model: 'gemini-pro', // Specify the model
  requestBody: {
      contents: [{
          parts: [{
              text: "Write a story about a magic backpack."
          }]
      }]
  }
};

api.generateContent(generateContentParams)(
  (result) => {
    console.log('generateContent Result:', result);
    // Process the result here
    if (result.candidates && result.candidates.length > 0) {
      console.log("Generated Text:", result.candidates[0].content.parts[0].text);
    }
  },
  (error) => {
    console.error('generateContent Error:', error);
    // Handle the error here
  }
);

// Using countTokens:
const countTokensParams = {
  model: 'gemini-pro',
  requestBody: {
    contents: [{
        parts: [{
            text: "Write a story about a magic backpack."
        }]
    }]
  }
};

api.countTokens(countTokensParams)(
  (result) => {
    console.log('countTokens Result:', result);
    // Process the result here
    console.log("Token Count:", result.totalTokens);
  },
  (error) => {
    console.error('countTokens Error:', error);
    // Handle the error here
  }
);

// Using embedContent:
const embedContentParams = {
  model: 'embedding-001',
  requestBody: {
    content: {
      parts: [{
        text: "Hello world"
      }]
    }
  }
};
api.embedContent(embedContentParams)(
    (result) => {
        console.log('embedContent Result:', result);
        // Process the result here
        console.log("Embedding:", result.embedding.values);
    },
    (error) => {
        console.error('embedContent Error:', error);
        // Handle the error here
    }
);

// Using batchEmbedContents:
const batchEmbedContentsParams = {
  model: 'embedding-001',
  requestBody: {
    requests: [
      {
        model: "models/embedding-001",
        content: {
          parts: [{
            text: "Hello"
          }]
        }
      },
      {
        model: "models/embedding-001",
        content: {
          parts: [{
            text: "world"
          }]
        }
      },
    ]
  }
};

api.batchEmbedContents(batchEmbedContentsParams)(
    (result) => {
        console.log('batchEmbedContents Result:', result);
        // Process the result here
        result.embeddings.forEach(embedding => console.log("Embedding:", embedding.values));
    },
    (error) => {
        console.error('batchEmbedContents Error:', error);
        // Handle the error here
    }
);