const express = require('express');
const app = new express();

/*This tells the server to use the client 
folder for all static resources*/
app.use(express.static('client'));

/*This tells the server to allow cross origin references*/
const cors_app = require('cors');
app.use(cors_app());

/*Using environment variables for API key/url*/
const dotenv = require('dotenv');
dotenv.config();

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL;

/*Instantiating IBM Watson NLU*/
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

function getNLUInstance() {
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-08-01',
        authenticator: new IamAuthenticator ({
            apikey: api_key
        }),
        serviceUrl: api_url
    });
    return naturalLanguageUnderstanding;
}

//The default endpoint for the webserver
app.get("/",(req,res)=>{
    res.render('index.html');
  });

//The endpoint for the webserver ending with /url/emotion
app.get("/url/emotion", (req,res) => {
    let urlToAnalyze = req.query.url
    const analyzeParams = 
        {
            "url": urlToAnalyze,
            "features": {
                "keywords": {
                    "emotion": true,
                    "limit": 1
                }
            }
        }
     
     const naturalLanguageUnderstanding = getNLUInstance();
     
     naturalLanguageUnderstanding.analyze(analyzeParams)
     .then(analysisResults => {
        const emotionResult = analysisResults.result.keywords[0]?.emotion || [];
        return res.send(emotionResult,null,2);
     })
     .catch(err => {
        return res.send("Could not do desired operation "+err);
     });
});

//The endpoint for the webserver ending with /url/sentiment
app.get("/url/sentiment", (req,res) => {
    let urlToAnalyze = req.query.url
    const analyzeParams = 
        {
            "url": urlToAnalyze,
            "features": {
                "keywords": {
                    "sentiment": true,
                    "limit": 1
                }
            }
        }
     
     const naturalLanguageUnderstanding = getNLUInstance();
     
     naturalLanguageUnderstanding.analyze(analyzeParams)
     .then(analysisResults => {
        const sentimentResult = analysisResults.result.keywords[0]?.sentiment || [];
        return res.send(sentimentResult,null,2);
     })
     .catch(err => {
        return res.send("Could not do desired operation "+err);
     });
});

//The endpoint for the webserver ending with /text/emotion
app.get("/text/emotion", (req,res) => {
    let textToAnalyze = req.query.text
    const analyzeParams = 
        {
            "text": textToAnalyze,
            "features": {
                "keywords": {
                    "emotion": true,
                    "limit": 1
                }
            }
        }
     
     const naturalLanguageUnderstanding = getNLUInstance();
     
     naturalLanguageUnderstanding.analyze(analyzeParams)
     .then(analysisResults => {
        const emotionResult = analysisResults.result.keywords[0]?.emotion || [];
        return res.send(emotionResult,null,2);
     })
     .catch(err => {
        return res.status(err.code).send("Could not do desired operation: "+err.statusText);
     });
});

app.get("/text/sentiment", (req,res) => {
    let textToAnalyze = req.query.text
    const analyzeParams = 
        {
            "text": textToAnalyze,
            "features": {
                "keywords": {
                    "sentiment": true,
                    "limit": 1
                }
            }
        }
     
     const naturalLanguageUnderstanding = getNLUInstance();
     
     naturalLanguageUnderstanding.analyze(analyzeParams)
     .then(analysisResults => {
        const sentimentResult = analysisResults.result.keywords[0]?.sentiment || [];
        return res.send(sentimentResult,null,2);
     })
     .catch(err => {
        return res.send("Could not do desired operation "+err);
     });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

