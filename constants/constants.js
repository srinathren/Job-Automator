export const PORT = process.env.PORT || 3000;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBhkkqwTelwjLjL-LH1XavOVeaBSzRLwvQ';
export const GET_NAUKRI_JOBS_ENDPOINT = process.env.GET_NAUKRI_JOBS_ENDPOINT || 'https://www.naukri.com/jobapi/v3/search'

export const USER_DATA = process.env.USER_DATA || {
    name: "Srinath Venkataraman",
    experienceTitle: "1 year at Bounteous India",
    experienceDescription: "Worked on various projects on Java Full Stack and gained practical experience in Software Development",
    role: "Software Analyst",
    education : "Bachelor Of Engineer Computer Science and Engineering, in Thiagarajar College of Engineering",
    skills : "spring boot, Java, Node jS, Problem solving, Web development, Mongo db",
    phoneNumber : "+91 9790425314",
    emailAddress: "srinathvenkataraman15@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/srinath-venkataraman"
}

export const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'