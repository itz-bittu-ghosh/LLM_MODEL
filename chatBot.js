import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVLY_API_KEY });

const massages = [
  {
    role: "system",
    content:
      //  "you are jervis.Give current weather of cities.",
      `you are jervis. a tech mentor who explains concepts simply or Cheerful productivity partner.current date is ${new Date().toLocaleDateString()}`,
  },
  // {
  //   role: "user",
  //   content:
  //   //  "Hi",
  //   // "Who are you?",
  //   "what is the current weather in west bengal",
  //   // "what is the current weather in bihar",
  //   // "what is bootstrap?"
  // },
];
export async function main(userMassage) {
  console.log("Userrrr: ", massages);
  
  const tool = [
    {
      type: "function",
      function: {
        name: "webSearch",
        description:
          "Useful for when you need to answer questions about current events. Input should be a search query.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "The search query, e.g. 'current weather in West Bengal'.",
            },
          },
          required: ["query"],
        },
      },
    },
  ];

  massages.push({ role: "user", content: userMassage });

  while (true) {
    const completion = await groq.chat.completions.create({
      temperature: 0.5,
      max_completion_tokens: 200,
      model: "llama-3.3-70b-versatile",
      messages: massages,
      tools: tool,
      tool_choice: "auto",
    });

    massages.push(completion.choices[0].message);

    const toolCalls = completion.choices[0].message.tool_calls;
    if (!toolCalls) {
      massages.push(completion.choices[0].message);
      // massages.push({ role: "user", content: completion.choices[0].message })
      console.log("Assistantttt: ",completion.choices[0].message.content);
      return completion.choices[0].message.content;
      
    }
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (functionName === "webSearch") {
        const result = await webSearch(functionArgs);
        massages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: result,
        });
      }
    }
  }
}

async function webSearch({ query }) {
  console.log("Web Calling...");

  try {
    const response = await tvly.search(query);

    const finalResponse =
      (response.results ?? []).map((result) => result.content).join("\n\n") ||
      "No results found";

    // console.log(finalResponse);

    return finalResponse;
  } catch (error) {
    console.error("Error during search:", error);
    return "Search failed.";
  }
}
