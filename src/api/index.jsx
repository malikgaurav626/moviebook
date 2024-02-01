export default async function getAllMovieData(currentPage=1) {
  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows?page=${currentPage}`
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}


export async function fetchWithQuery(query){
    try{
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        const data = await response.json();
        
        const revisedData = data.map((item) => item.show);
        return revisedData;
    }catch(e){
        console.error(e);
    }
}
