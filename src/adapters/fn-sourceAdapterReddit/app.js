const AWS = require('aws-sdk')
var eventbridge = new AWS.EventBridge({apiVersion: '2015-10-07'});
/*

* https://www.reddit.com/prefs/apps
* https://github.com/reddit-archive/reddit/wiki/OAuth2-Quick-Start-Example
* https://not-an-aardvark.github.io/snoowrap/Subreddit.html#getNew__anchor

*/

const mySubreddit = 'AskReddit'

const snoowrap = require('snoowrap');


exports.lambdaHandler = async ( event ) => {
    const r = new snoowrap({
        userAgent: 'HTF De Paradepaardjes by u/LowRinseProjects/',
        clientId: '9iB_fcW5Te3_DEIOg64RJg',
        clientSecret: 'vE2ox783ODs9vY1LjsvIdlHNTyxFzQ',
        refreshToken: '409383219511-NHoitUBhiRruhWlasWFGafJHgM9p_A'
      });
    
    try {
        console.log(JSON.stringify(event))

        // STEP 1: Poll for new reddit entries
        const subreddit = await r.getSubreddit(mySubreddit)
        const newPosts = await subreddit.getNew()
        
        console.log(JSON.stringify(newPosts[0]))

        let entries = []

        newPosts.forEach(async (post) => {
            if (entries.length < 10) {entries.push({
                Source:"com.reddit.listing",
                EventBusName: 'deparadepaardjes-htf-2021-reddit',
                DetailType:"post",
                Detail: JSON.stringify({
                    id: post.id,
                    text: post.title,
                    author_fullname: post.author_fullname
                })})
            } else {
                let params = {Entries: entries}
                var result = await eventbridge.putEvents(params).promise()
                console.log(JSON.stringify(result))
                entries = []
            }
        })       

        return "Succesfully finished"
    } catch (err) {
        console.log(err, err.trace);
        throw err
    }
};
