---
name: semantic-search
description: "Search toys using natural language powered by embeddings."
---

# Semantic Search Skill

## Overview

This skill enables semantic search across the Tailspin Toys product catalog. Users can search using natural language queries like "electronic toys for kids" and get relevant results even if exact keywords don't match product names.

## How It Works

1. **Pre-computed Embeddings**: All toys have embeddings stored in `embeddings.json`
2. **Query Embedding**: User query is converted to an embedding via Azure OpenAI
3. **Similarity Search**: Cosine similarity finds the most relevant toys
4. **Ranked Results**: Toys returned sorted by relevance score

## Usage

### Command Line
```bash
# Search for toys
python .github/skills/semantic-search/agent.py "electronic toys from the 90s"

# Regenerate all toy embeddings
python .github/skills/semantic-search/agent.py --reindex
```

### API Endpoint
```bash
POST /api/search
Content-Type: application/json

{"query": "classic gully games for kids"}
```

### Response
```json
{
  "query": "classic gully games for kids",
  "results": [
    {
      "name": "Water Ring Toss",
      "category": "Classic",
      "price": 799,
      "score": 0.92
    },
    {
      "name": "Simon",
      "category": "Electronic",
      "price": 2499,
      "score": 0.85
    }
  ]
}
```

## Example Queries

| Query | Expected Top Results |
|-------|---------------------|
| "electronic toys" | Simon, Furby, Speak & Spell |
| "classic toys for young kids" | Water Ring Toss, Cabbage Patch Kid |
| "activity toys" | Mr Frosty |
| "toys that talk" | Furby, Speak & Spell |
| "nostalgic 90s toys" | Furby, Simon, Speak & Spell |

## Files

| File | Purpose |
|------|---------|
| `agent.py` | Main skill logic — embedding generation and search |
| `embeddings.json` | Pre-computed toy embeddings |
| `SKILL.md` | This documentation |

## Configuration

Uses Azure OpenAI with:
- **Endpoint**: `AZURE_OPENAI_ENDPOINT` environment variable
- **Model**: `text-embedding-ada-002`
- **Authentication**: DefaultAzureCredential (Managed Identity)

## Regenerating Embeddings

Run this when the toy catalog changes (e.g., after re-seeding the database):
```bash
python .github/skills/semantic-search/agent.py --reindex
```

This will:
1. Load all toys from the Prisma database
2. Create text representation of each toy (name, category, tagline, age range)
3. Generate embeddings via Azure OpenAI
4. Save to `embeddings.json`
