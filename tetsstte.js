const url = "https://api.inhire.app/job-posts/public/pages/careerPage/sidia";

async function getJobs() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Tenant": "sidia",
        "User-Agent": "Mozilla/5.0"
      }
    });

    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Resposta:", text);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = JSON.parse(text);

    console.log("\nJSON:");
    console.dir(data, { depth: null });

  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

getJobs();
