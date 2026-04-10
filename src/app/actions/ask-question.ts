"use server";

import { DefaultAzureCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

const projectEndpoint = process.env.AZURE_PROJECT_ENDPOINT || "";
const agentName = process.env.AZURE_AGENT_NAME || "";
const agentVersion = process.env.AZURE_AGENT_VERSION || "";

/**
 * Sends a question to the Azure Foundry FAQ agent and gets a response.
 * This server action is secure as it runs on the server and uses Azure credentials.
 */
export async function askQuestion(question: string): Promise<string> {
  try {
    // Create AI Project client with default Azure credentials
    const projectClient = new AIProjectClient(
      projectEndpoint,
      new DefaultAzureCredential()
    );

    // Get the OpenAI client from the project
    const openAIClient = projectClient.getOpenAIClient();

    // Create conversation with the user's question
    const conversation = await openAIClient.conversations.create({
      items: [{ type: "message", role: "user", content: question }],
    });

    // Generate response using the agent
    const response = await openAIClient.responses.create(
      {
        conversation: conversation.id,
      },
      {
        body: {
          agent: {
            name: agentName,
            version: agentVersion,
            type: "agent_reference",
          },
        },
      }
    );
    return response.output_text || "Unable to generate response";
  } catch (error) {
    console.error("Error calling Azure Foundry:", error);
    throw new Error(
      "Failed to get an answer. This may be because I'm unable to answer questions on that topic, or there's been another error. Please try again or contact our support team."
    );
  }
}
