import Nylas from 'nylas';
import config from '../config/nylasConfig.js';
import fs from 'fs'

const nylas = new Nylas({
  apiKey: config.apiKey,
  apiUri: config.apiUri,
});



export async function createDraft({companyName, content, jobTitle, pdfPath, grantID}) {
      const draft = {
        subject: "RESUME for "+jobTitle+" at : " + companyName,
        to: [{ name: "Recipient Name", email: "recipient@example.com" }],
        body: content,
        attachments: [{
          filename: 'Resume.pdf' ,
          content: fs.readFileSync(pdfPath).toString('base64'),
          contentType: 'application/pdf',
        }]
      }
  
      const createdDraft = await nylas.drafts .create({
          identifier: grantID,
          requestBody:  draft
      })
  
      console.log('Draft created:', createdDraft)
  
}


export default nylas;
