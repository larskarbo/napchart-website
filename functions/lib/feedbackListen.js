const admin = require('firebase-admin')
admin.initializeApp()
const axios = require('axios')

exports.feedbackListen = functions.firestore.document('feedback/{feedbackId}').onCreate((snap, context) => {
  axios.get(
    `https://api.telegram.org/bot1196576929:AAFCVPBTMcSUlrHAIFBO_Ni7e9em0Nje10U/sendMessage?chat_id=912275377&text=add-feedback`,
  )
})
