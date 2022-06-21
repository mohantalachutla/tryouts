require("dotenv").config()
if(!process.env?.DOT_ENV_CHECK) throw new Error(".env file is missing")
const functions = require("firebase-functions");
const admin = require("firebase-admin");

const os = require("os")
const path = require("path")

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// default region us-central1
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!");
  response.send("Hello from Firebase!");
});

const logger = functions.logger

exports.parseCSV = functions
    .region("asia-southeast1")
    .storage.object()
    .onFinalize(async (object, context) => {
        try {
            logger.log("context "+ JSON.stringify(context))
            logger.log("object "+ JSON.stringify(object))

            const {bucket, name: filePath, contentType, metageneration} = object

            const tempFilePath = path.join(os.tmpdir(), path.basename(filePath))
            await admin.storage().bucket(bucket).file(filePath).createReadStream().on("data", (chuck) => {
                logger.log({chuck})
            }).on("error", (err) => {
                logger.error({err})
            })
            // download({
            //     destination: tempFilePath
            // })
            logger.log(`file successfully downloaded at ${tempFilePath}`)
        } catch (err) {
            logger.error(err)
        }

})


admin.initializeApp({
    databaseURL: process.env.FB_DATABASE_URL,
    storageBucket: process.env.FB_STORAGE_URL
})

