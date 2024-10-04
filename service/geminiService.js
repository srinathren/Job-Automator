import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBhkkqwTelwjLjL-LH1XavOVeaBSzRLwvQ');

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export async function generateResumeContent({jobDescription, jobTitle, requirements, userInfo, companyName}) {
    let prePrompt = `
      This is a job title :  
      ${jobTitle}
      
      Job description is : 
      ${jobDescription}

      Requirements are :
      ${requirements}


      My current info is : ${JSON.stringify(userInfo)}, Can you build a detailed ready to send resume for the company : ${companyName}, and output only the resume data

      Make sure to not have any placeholers, use and create with given information, and give me the response in HTML format with full page styling of an A4 sheet, since i will directly send it to the HR,
      Also make sure to have the following fields  in the resume : 
       - Why i would be an apt candidate, to the role
       - Objective
       - Experience
       and include other good fields too, make it a 2 page detailed resume
        
      `;
  
      
    const result = await model.generateContent(prePrompt);
    const response = result.response;
  
    return response.text();
  }

  export async function getAiSuggestedFolderId_GeminiService({jsonData, jobData}) {
    let prePrompt = `This is my jobData, and i need to classify it to the appropriate folder name.
    Every folder name has it's approriate ID, here is the name ID pair in Json format : ${JSON.stringify(jsonData)}.
    
    Give me the matching id , that matches with the jobData: ${jobData} and the name of the folder.
    Ill be integrating the response to an ID input, so give me only the ID value in one line, dont respond any extra characters other than that.`

    const result = await model.generateContent(prePrompt);
    console.log("Found folder ID " + result.response.text().trim() );
    return result.response.text().trim();
  }
