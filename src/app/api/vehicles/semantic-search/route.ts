import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildVehicleSearchableText } from "@/lib/vehicle-search";

interface AzureSemanticResult {
  id?: string;
}

interface AzureSemanticResponse {
  value?: AzureSemanticResult[];
}

/**
 * Attempts semantic ranking through Azure AI Search.
 * If Azure configuration is unavailable or the request fails, local fallback is used.
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length === 0) {
    return NextResponse.json({ enhanced: false, orderedIds: [] });
  }

  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, name: true, shortTagline: true, category: true, range: true },
  });

  const localRankedIds = vehicles
    .filter((vehicle) => {
      const searchableText = buildVehicleSearchableText(vehicle);
      return searchableText.includes(query.toLowerCase());
    })
    .map((vehicle) => vehicle.id);

  const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
  const indexName = process.env.AZURE_SEARCH_INDEX_NAME;
  const apiKey = process.env.AZURE_SEARCH_API_KEY;
  const semanticConfiguration = process.env.AZURE_SEARCH_SEMANTIC_CONFIGURATION ?? "default";

  if (!endpoint || !indexName || !apiKey) {
    return NextResponse.json({ enhanced: false, orderedIds: localRankedIds });
  }

  try {
    const url = `${endpoint.replace(/\/$/, "")}/indexes/${indexName}/docs/search?api-version=2024-07-01`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        search: query,
        queryType: "semantic",
        semanticConfiguration,
        select: "id",
        top: 50,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Azure semantic search request failed");
    }

    const payload = (await response.json()) as AzureSemanticResponse;
    const azureOrderedIds =
      payload.value
        ?.map((result) => result.id)
        .filter((id): id is string => typeof id === "string" && id.length > 0) ?? [];

    if (azureOrderedIds.length === 0) {
      return NextResponse.json({ enhanced: false, orderedIds: localRankedIds });
    }

    return NextResponse.json({ enhanced: true, orderedIds: azureOrderedIds });
  } catch {
    return NextResponse.json({ enhanced: false, orderedIds: localRankedIds });
  }
}
