import { NextResponse } from 'next/server';

interface AzureSearchDocument {
  id?: string;
  slug?: string;
}

interface AzureSearchResponse {
  value?: AzureSearchDocument[];
}

/* Optional semantic search endpoint that gracefully falls back when Azure Search is not configured */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json({ matches: [] });
  }

  const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
  const indexName = process.env.AZURE_SEARCH_INDEX_NAME;
  const apiKey = process.env.AZURE_SEARCH_API_KEY;

  if (!endpoint || !indexName || !apiKey) {
    return NextResponse.json(
      { matches: [], message: 'AI search is not configured. Showing local results.' },
      { status: 503 },
    );
  }

  const normalizedEndpoint = endpoint.replace(/\/+$/, '');
  const azureSearchUrl = `${normalizedEndpoint}/indexes/${encodeURIComponent(indexName)}/docs/search?api-version=2024-07-01`;

  try {
    const response = await fetch(azureSearchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        search: query,
        queryType: 'semantic',
        searchFields: 'name,category,shortTagline,range',
        top: 30,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { matches: [], message: 'AI search is temporarily unavailable. Showing local results.' },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as AzureSearchResponse;
    return NextResponse.json({ matches: payload.value ?? [] });
  } catch {
    return NextResponse.json(
      { matches: [], message: 'AI search is temporarily unavailable. Showing local results.' },
      { status: 502 },
    );
  }
}
