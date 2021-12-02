
const AWS = require('aws-sdk')

var translate = new AWS.Translate({apiVersion: '2017-07-01'});
var comprehend = new AWS.Comprehend({apiVersion: '2017-11-27'});
var eventbridge = new AWS.EventBridge({apiVersion: '2015-10-07'});

const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'hi', 'ja', 'ko', 'zh', 'zh-TW'];

exports.lambdaHandler = async ( event ) => {

    try {

        // STEP 1: Log incoming event and environment variables
        console.log("Received event: " + JSON.stringify(event))
        console.log("IdentifiedCluesEventbusArn: " + process.env.IdentifiedCluesEventbusArn )   
        
        // STEP 2: Perform Analysis
        var analysis = await analyseText(event.text)

        // STEP 3: Create enriched event
        var identifiedclueEvent = {
            source: event.source,
            text: event.text,
            language: analysis.detectedLanguage,
            sentiment: analysis.sentiment
        }

        console.log(JSON.stringify(identifiedclueEvent))

        // STEP 4: Publish to configured EventBridge Eventbus
        params = {Entries: [{
            Source:"com.aws.sentiment",
            EventBusName: 'deparadepaardjes-htf-2021-IdentifiedClues',
            DetailType:"post",
            Detail: JSON.stringify(identifiedclueEvent)
        }]}
        var result = await eventbridge.putEvents(params).promise()
        console.log("Published to eventbus: " + JSON.stringify(result))
        
        return "succesfully finished"
    } catch (err) {
        console.log(err);
        throw err
    }
};

async function analyseText(text) {
    //  STEP 1: Detect language
    var paramsDetectLanguage =  {
        Text: text
    }
    var detectedLanguage = await comprehend.detectDominantLanguage(paramsDetectLanguage).promise()
    console.log("Detected languages: " + JSON.stringify(detectedLanguage))

    // STEP 2: Translate to english if language is not supported
    if (!supportedLanguages.indexOf(detectedLanguage) > -1) {
        // Language not supported: translate to english
        var paramsTranslateLanguage = {
            Text: text,
            SourceLanguageCode: detectedLanguage.Languages[0].LanguageCode,
            TargetLanguageCode: 'en'
        };

        var dataTranslatedText =  await translate.translateText(paramsTranslateLanguage).promise()
    }

    // STEP 3: Detect Sentiment
    var paramsDetectSentiment =  {
        LanguageCode: 'en',
        Text: dataTranslatedText.TranslatedText
    }
    var sentiment = await comprehend.detectSentiment(paramsDetectSentiment, function(err, data) {
        if (err) console.log(err, err.stack);  
    }).promise()

    return {
        detectedLanguage: detectedLanguage.Languages[0].LanguageCode,
        sentiment: sentiment.Sentiment
    }
}
