export const BASE_PATH = "./data/";

export async function loadFolder(folderName) {
    const indexFile = `${BASE_PATH}${folderName}/index.json`;

    try {
        const indexList = await fetch(indexFile).then(r => r.json());
        const result = [];

        for (let file of indexList) {
            const fileURL = `${BASE_PATH}${folderName}/${file}`;
            try {
                const json = await fetch(fileURL).then(r => r.json());
                result.push(json);
            } catch (e) {
                console.log("JSON Error:", fileURL);
            }
        }

        return result;
    } catch (err) {
        console.log("Index load error:", indexFile, err);
        return [];
    }
}

export const FOLDERS = {
    episodes: "episodes",
    trending: "trending",
    newReleases: "newreleases",
    topRated: "toprated",
    added: "added"
};
