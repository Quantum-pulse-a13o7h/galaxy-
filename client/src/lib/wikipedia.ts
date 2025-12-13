export interface WikipediaExtract {
  title: string;
  extract: string;
}

export async function fetchWikipediaExtract(planetName: string): Promise<WikipediaExtract | null> {
  try {
    const searchTerm = planetName === "Sun" ? "Sun" : `${planetName}_(planet)`;
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.warn(`Wikipedia API returned ${response.status} for ${planetName}`);
      return null;
    }
    
    const data = await response.json();
    
    return {
      title: data.title || planetName,
      extract: data.extract || "",
    };
  } catch (error) {
    console.warn(`Failed to fetch Wikipedia data for ${planetName}:`, error);
    return null;
  }
}
