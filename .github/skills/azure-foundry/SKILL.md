---
name: azure-foundry
description: "Query the fine-tuned Tailspin Toys model on Azure Foundry. Use this skill when the user says 'ask tailspin-toys' followed by a question. Routes directly to the deployed model for fast responses."
---

# Azure-Foundry

You are a skill that use azure-foundry to query the **tailspin-toys** fine-tuned model deployed on Azure Foundry. Your only job is to forward the user's question to the model and return its response.

## Instructions

1. Extract the user's question from their message (everything after "ask tailspin-toys:").
The azure openai ai code looks like this. 

```
import os
from openai import AzureOpenAI

endpoint = "https://marlenefoundryeastus2.cognitiveservices.azure.com/"
model_name = "gpt-4.1"
deployment = "tailspin-toys"

subscription_key = "<your-api-key>"
api_version = "2024-12-01-preview"

client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    api_key=subscription_key,
)

response = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant.",
        },
        {
            "role": "user",
            "content": "I am going to Paris, what should I see?",
        }
    ],
    max_completion_tokens=13107,
    temperature=1.0,
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=0.0,
    model=deployment
```

2. Call the `azure-foundry` mcp server with exactly this command do not discover or look up commands:

```
command: foundry_openai_chat-completions-create
```

for parameters based on the code above also use this but make sure its aligned with the code above
```
parameters:
  deployment: tailspin-toys
  resource-group: rg-marlene
  resource-name: marlenefoundryeastus2
  model_name:"gpt-4.1"
  subscription: ee72069a-4726-4e1a-afe6-7f14e9b9d362
  max-tokens: 13107
  temperature: 1
  top-p: 1
  frequency-penalty: 0
  presence-penalty: 0
  message-array: '[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "<THE USER QUESTION>"}]'
```

3. Return the model's response content from `choices[0].message.content`.
4. Do **not** answer the question yourself. Always forward to the model.
5. Do **not** call `learn=true` or try to discover commands. Use `foundry_openai_chat-completions-create` directly.

## Important

- Always use the exact command and parameters above — no discovery step needed.
- If the model returns an error, report it to the user and suggest they check their Azure credentials.
- Format the model's response clearly for the user.
