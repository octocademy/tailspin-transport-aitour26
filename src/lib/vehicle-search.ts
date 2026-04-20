interface AzureVehicleSearchResult {
  ids: string[];
  usedAzure: boolean;
}

function normalizeEndpoint(endpoint: string) {
  return endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
}

export async function searchVehicleIdsWithAzure(query: string): Promise<AzureVehicleSearchResult> {
  const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
  const indexName = process.env.AZURE_SEARCH_INDEX_NAME;
  const apiKey = process.env.AZURE_SEARCH_API_KEY;
  const semanticConfiguration = process.env.AZURE_SEARCH_SEMANTIC_CONFIGURATION;

  if (!endpoint || !indexName || !apiKey || !query.trim()) {
    return { ids: [], usedAzure: false };
  }

  try {
    const requestBody: Record<string, unknown> = {
      search: query,
      top: 50,
      select: 'id',
    };

    if (semanticConfiguration) {
      requestBody.queryType = 'semantic';
      requestBody.semanticConfiguration = semanticConfiguration;
      requestBody.queryLanguage = 'en-us';
    }

    const response = await fetch(
      `${normalizeEndpoint(endpoint)}/indexes/${indexName}/docs/search?api-version=2024-07-01`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return { ids: [], usedAzure: false };
    }

    const data = (await response.json()) as {
      value?: Array<{ id?: string }>;
    };

    const ids = (data.value ?? [])
      .map((item) => item.id)
      .filter((id): id is string => typeof id === 'string');

    return { ids, usedAzure: true };
  } catch (error) {
    console.error('Azure AI Search request failed. Falling back to local search.', error);
    return { ids: [], usedAzure: false };
  }
}

// Extracts numeric range values from strings such as "451 km"; returns null when no finite number is found.
export function parseRangeValueInKm(value: string) {
  const match = value.match(/(\d+(?:\.\d+)?)/);

  if (!match) {
    return null;
  }

  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}
