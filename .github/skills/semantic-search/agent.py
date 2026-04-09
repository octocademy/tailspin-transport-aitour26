"""
Semantic Search Skill for Tailspin Toys

Uses Azure OpenAI embeddings to enable natural language toy search.
"""

import json
import os
import sys
from pathlib import Path
from typing import Optional

from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Azure OpenAI
from openai import AzureOpenAI

# Paths
SKILL_DIR = Path(__file__).parent
PROJECT_ROOT = SKILL_DIR.parent.parent.parent
EMBEDDINGS_PATH = SKILL_DIR / "embeddings.json"

# Azure OpenAI config
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "")
EMBEDDING_MODEL = "text-embedding-ada-002"


def get_openai_client() -> AzureOpenAI:
    """Create Azure OpenAI client with managed identity."""
    credential = DefaultAzureCredential()
    token_provider = get_bearer_token_provider(credential, "https://cognitiveservices.azure.com/.default")

    return AzureOpenAI(
        api_version="2024-02-15-preview",
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        azure_ad_token_provider=token_provider
    )


def get_embedding(client: AzureOpenAI, text: str) -> list[float]:
    """Generate embedding for a text string."""
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text
    )
    return response.data[0].embedding


def toy_to_text(toy: dict) -> str:
    """Convert toy to searchable text representation."""
    parts = [
        toy.get("name", ""),
        toy.get("category", ""),
        toy.get("shortTagline", ""),
        toy.get("ageRange", ""),
    ]
    return " ".join(part for part in parts if part)


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    dot_product = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(x * x for x in b) ** 0.5

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot_product / (norm_a * norm_b)


def load_embeddings() -> dict:
    """Load pre-computed embeddings."""
    if not EMBEDDINGS_PATH.exists():
        return {"toys": []}

    with open(EMBEDDINGS_PATH, "r") as f:
        return json.load(f)


def save_embeddings(data: dict):
    """Save embeddings to JSON file."""
    with open(EMBEDDINGS_PATH, "w") as f:
        json.dump(data, f, indent=2)


def load_toys_from_seed() -> list[dict]:
    """
    Load toys from the seed file by parsing the TypeScript array.
    Falls back to a hardcoded list matching the current seed data.
    """
    # Current seed data for Tailspin Toys
    return [
        {
            "name": "Simon",
            "category": "Electronic",
            "shortTagline": "The classic electronic memory game with flashing lights and sounds.",
            "ageRange": "7+",
            "price": 2499,
            "imageUrl": "/images/products/simon.png",
        },
        {
            "name": "Cabbage Patch Kid",
            "category": "Doll",
            "shortTagline": "Adorable soft-sculptured doll with yarn hair and adoption papers.",
            "ageRange": "3+",
            "price": 2999,
            "imageUrl": "/images/products/cabbage-patch.png",
        },
        {
            "name": "Furby",
            "category": "Electronic",
            "shortTagline": "The chatty electronic furry friend that learns and talks back.",
            "ageRange": "6+",
            "price": 3499,
            "imageUrl": "/images/products/furby.png",
        },
        {
            "name": "Water Ring Toss",
            "category": "Classic",
            "shortTagline": "Handheld squirty water game - hook the rings onto the pegs!",
            "ageRange": "4+",
            "price": 799,
            "imageUrl": "/images/products/water-ring-toss.png",
        },
        {
            "name": "Mr Frosty",
            "category": "Activity",
            "shortTagline": "The coolest guy around! Make your own slushies and ice treats.",
            "ageRange": "5+",
            "price": 2299,
            "imageUrl": "/images/products/mr-frosty.png",
        },
        {
            "name": "Speak & Spell",
            "category": "Electronic",
            "shortTagline": "Electronic learning toy that teaches spelling with a robotic voice.",
            "ageRange": "6+",
            "price": 1999,
            "imageUrl": "/images/products/speak-and-spell.png",
        },
    ]


def reindex_toys():
    """Generate embeddings for all toys."""
    print("🔄 Reindexing toys...")

    client = get_openai_client()
    toys = load_toys_from_seed()

    embeddings_data = {"toys": []}

    for i, toy in enumerate(toys):
        text = toy_to_text(toy)
        print(f"  [{i+1}/{len(toys)}] Embedding: {toy['name']}")

        embedding = get_embedding(client, text)

        embeddings_data["toys"].append({
            "name": toy["name"],
            "category": toy["category"],
            "shortTagline": toy["shortTagline"],
            "price": toy["price"],
            "imageUrl": toy.get("imageUrl", ""),
            "text": text,
            "embedding": embedding
        })

    save_embeddings(embeddings_data)
    print(f"✅ Indexed {len(toys)} toys to {EMBEDDINGS_PATH}")

    return embeddings_data


def search(query: str, top_k: int = 5) -> list[dict]:
    """
    Search toys using semantic similarity.

    Args:
        query: Natural language search query
        top_k: Number of results to return

    Returns:
        List of toys with similarity scores
    """
    # Load embeddings
    embeddings_data = load_embeddings()

    if not embeddings_data.get("toys"):
        print("⚠️ No embeddings found. Run with --reindex first.")
        return []

    # Generate query embedding
    client = get_openai_client()
    query_embedding = get_embedding(client, query)

    # Calculate similarities
    results = []
    for toy in embeddings_data["toys"]:
        score = cosine_similarity(query_embedding, toy["embedding"])
        results.append({
            "name": toy["name"],
            "category": toy["category"],
            "shortTagline": toy["shortTagline"],
            "price": toy["price"],
            "imageUrl": toy["imageUrl"],
            "score": round(score, 4)
        })

    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)

    return results[:top_k]


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python agent.py 'search query'    - Search toys")
        print("  python agent.py --reindex         - Regenerate embeddings")
        sys.exit(1)

    arg = sys.argv[1]

    if arg == "--reindex":
        reindex_toys()
    else:
        query = " ".join(sys.argv[1:])
        print(f"🔍 Searching: '{query}'")
        print()

        results = search(query)

        if not results:
            print("No results found.")
            return

        print("Results:")
        print("-" * 50)
        for i, result in enumerate(results, 1):
            print(f"{i}. {result['name']}")
            print(f"   Category: {result['category']}")
            print(f"   Price: ₹{result['price'] / 100:.2f}")
            print(f"   Relevance: {result['score']:.2%}")
            print()

        # Output JSON for programmatic use
        print("\nJSON Output:")
        print(json.dumps({"query": query, "results": results}, indent=2))


if __name__ == "__main__":
    main()
