import express from "express";
import { BACKEND_URL, GET_NAUKRI_JOBS_ENDPOINT, PORT, USER_DATA } from "./constants/constants.js";
import cors from 'cors';
import axios from 'axios';
import bodyParser from "body-parser";
import { generateResumeContent, getAiSuggestedFolderId_GeminiService } from "./service/geminiService.js";
import { createDraft } from "./service/nylasService.js";
import fs from 'fs';
import ConvertAPI from "convertapi";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from 'url';
import authRouter from './routes/authRouter.js'

var convertapi = ConvertAPI('secret_OQIfrtBCzdKr3Oud');

// Convert import.meta.url to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

async function convertPdfToHtml() {
    try {
        const inputPath = path.join(resolve(__dirname), 'resume.html');
        const outputPath = path.join(resolve(__dirname));

        const result = await convertapi.convert('pdf', { File: inputPath }, 'html');

        console.log("Succeeded");
        await result.saveFiles(outputPath);
        console.log("Saved");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

app.get('/', (req, res) => {
    res.render('form', {
        backendUrl : BACKEND_URL
    });
});


app.get('/thank-you', (req, res) => {
    res.render('thank-you');
})
app.use('/auth', authRouter );

app.post('/getJobs', async (req, res) => {
    const { keyword, limit, grantID } = req.body.data;
    const userInfo = req.body.userInfo;

    console.log("Key word " + keyword + " limit : " + limit)

    console.log(path.join(resolve(__dirname), 'resume.pdf'));

    let url = GET_NAUKRI_JOBS_ENDPOINT + `?noOfResults=${limit}&urlType=search_by_keyword&searchType=adv&keyword=${keyword}&pageNo=1`;
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Systemid': 'Naukri',
                'Appid': '109'
            }
        });

        const jobDataArray = response.data.jobDetails;

        for (let jobData of jobDataArray) {
            await resumeWorkflow({ jobData, userInfo, grantID });
        }

        res.json({ ok: 1 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job data' });
    }
});

const resumeWorkflow = async ({ jobData  , userInfo, grantID}) => {
    console.log(`Starting to write resume... for ${jobData.title}`);

    const resumeData = await generateResumeContent({
        jobDescription: jobData.jobDescription,
        companyName: jobData.companyName,
        jobTitle: jobData.title,
        requirements: jobData.tagsAndSkills,
        userInfo
    });

    console.log("Generated resume by AI");

    console.log("Starting to write the html file");
    writeResumeDataToHtml(resumeData);
    console.log("Wrote the html file");

    checkAndDeleteIfFileExists();

    console.log("starting to convert txt to pdf");
    await convertPdfToHtml();
    console.log("End convert");

    const foundFolderId = await getAiSuggestedFolderId_GeminiService({ jobTitle: jobData.title });

    console.log("Starting to create a draft");
    const draftDetails = await createDraft({
        jobTitle: jobData.title,
        content: resumeData,
        companyName: jobData.companyName,
        pdfPath: path.join(resolve(__dirname), 'resume.pdf'),
        folderID: foundFolderId,
        grantID
    });

    console.log("Draft created");
};

const getAISuggestedFolderId = async ({jobTitle}) => {
    const data = await getFilteredAndFormattedFoldersData();


    const foundFolderId = await getAiSuggestedFolderId_GeminiService({jsonData : data, jobData: jobTitle})

    return foundFolderId.trim();
}
const writeResumeDataToHtml = (resumeData) => {
    fs.writeFileSync('./resume.html', resumeData, 'utf-8', (err) => {
        if(err){
            console.log("Errored " + JSON.stringify(err));
        }
        else{
            console.log("Successfully saved")
        }
    })
}

const checkAndDeleteIfFileExists = () => {
    if(fs.existsSync('./resume.pdf')){
        console.log("File found, deleting it")
        fs.unlinkSync('./resume.pdf', (err) => {
            if(err)
            console.log("Errored in unlinking !");
            else
            console.log("Success")
        });
    }
}

// app.use('/folderList',async (req, res,next) => {
//     const data = await getFilteredAndFormattedFoldersData();
//     res.json({data})
// })

const getFilteredAndFormattedFoldersData =async () => {
    const folderList = await getFoldersData();
    const data = folderList.data.filter((folderData) => {
        if (folderData.id.startsWith('Label'))
        return true
    })
    .map((folderData) => {
        return {
            id:folderData.id,
            name: folderData.name
        }
    })

    return data;
}

// app.use('/createDummyDraft', async(req, res, next) => {
//     const draftDetails = await createDraft({
//         jobTitle: 'dummy Job',
//         content: 'dummy content',
//         companyName: 'dummy companyName',
//         pdfPath: path.join(resolve(__dirname), 'wow.pdf'),
//         folderID : 'Label_4'
//     })  

//     res.json({data: draftDetails})

// })

app.use(cors())
app.use(bodyParser())
app.listen(PORT, () => {
    console.log(`Server connected on ${PORT}`)
})