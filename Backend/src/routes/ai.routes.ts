require("dotenv").config();
import { Router } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BASE_PROMPT, getSystemPrompt } from "../prompts";
import {basePrompt as nodeBasePrompt} from "../defaults/node";
import {basePrompt as reactBasePrompt} from "../defaults/react";

const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
 const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//this endpoint is used to get the initial prompts for the LLM to figure out what to do, it is a react or node project?
//@ts-ignore
router.post("/template", async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const geminiResponse = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                maxOutputTokens: 200,
            },
            systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
        });

        const response = await geminiResponse.response; // Access the response object
        //@ts-ignore
        const answer = response.candidates[0].content.parts[0].text.trim(); // Extract the answer

        if (answer === "react") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            });
            return;
        }

        if (answer === "node") {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            });
            return;
        }

        res.status(403).json({ message: "You cant access this" });
        return;

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ message: "Error communicating with Gemini API" });
    }
});


//@ts-ignore
router.post("/ai-talk", async (req, res) => {
    const messages = req.body.messages;

    try {
      //@ts-ignore
        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        const geminiResponse = await model.generateContent({
            contents: formattedMessages,
            generationConfig: {
                maxOutputTokens: 8000,
            },
            systemInstruction: getSystemPrompt(),
        });

        const response = await geminiResponse.response; // Access the response object
        //@ts-ignore
        const aiResponseText = response.candidates[0].content.parts[0].text;

        console.log(response);

        res.json({
            response: aiResponseText
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ message: "Error communicating with Gemini API" });
    }
});

export default router;





// ............... ANTHROPIC API CODE .........................................

// require("dotenv").config();
// import { Router } from 'express';
// import Anthropic from "@anthropic-ai/sdk";
// import { BASE_PROMPT, getSystemPrompt } from "../prompts";
// import {TextBlock } from "@anthropic-ai/sdk/resources";
// import {basePrompt as nodeBasePrompt} from "../defaults/node";
// import {basePrompt as reactBasePrompt} from "../defaults/react";


// const router = Router();

// const anthropic = new Anthropic();

// //this endpoint is used to get the initial prompts for the LLM to figure out what to do, it is a react or node project?
// //@ts-ignore
// router.post("/template", async (req, res) => {
//     const prompt = req.body.prompt;
    
//     const response = await anthropic.messages.create({
//         messages: [{
//             role: 'user', content: prompt
//         }],
//         model: 'claude-3-5-sonnet-20241022',
//         max_tokens: 200,
//         system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
//     })

//     const answer = (response.content[0] as TextBlock).text; // react or node
//     if (answer == "react") {
//         res.json({
//             prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
//             uiPrompts: [reactBasePrompt]
//         })
//         return;
//     }

//     if (answer === "node") {
//         res.json({
//             prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
//             uiPrompts: [nodeBasePrompt]
//         })
//         return;
//     }

//     res.status(403).json({message: "You cant access this"})
//     return;

// })

// //@ts-ignore
// router.post("/ai-talk", async (req, res) => {
//     const messages = req.body.messages;
//     const response = await anthropic.messages.create({
//         messages: messages,
//         model: 'claude-3-5-sonnet-20241022',
//         max_tokens: 8000,
//         system: getSystemPrompt()
//     })

//     console.log(response);

//     res.json({
//         response: (response.content[0] as TextBlock)?.text
//     });
// })


// export default router;






















