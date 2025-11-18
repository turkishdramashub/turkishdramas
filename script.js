import { loadFolder, FOLDERS } from "./config.js";

let allEpisodes = [];
let trendingEpisodes = [];
let newReleases = [];
let topRated = [];
let addedToWebsite = [];

const trendingSlider = document.getElementById("trending-slider");
const newReleasesSlider = document.getElementById("new-releases-slider");
const topRatedSlider = document.getElementById("top-rated-slider");
const addedSlider = document.getElementById("added-slider");

document.addEventListener("DOMContentLoaded", () => {
    console.log("🔥 GitHub JSON Loading Active");
    setupSliders();
    initSearch();
    showSkeleton(trendingSlider);
    showSkeleton(newReleasesSlider);
    showSkeleton(topRatedSlider);
    showSkeleton(addedSlider);
    loadAll();
});

function showSkeleton(slider) {
    slider.innerHTML = `
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
    `;
}

async function loadAll() {
    try {
        trendingEpisodes = await loadFolder(FOLDERS.trending);
        newReleases      = await loadFolder(FOLDERS.newReleases);
        topRated         = await loadFolder(FOLDERS.topRated);
        addedToWebsite   = await loadFolder(FOLDERS.added);
        allEpisodes      = await loadFolder(FOLDERS.episodes);

        populate(trendingSlider, trendingEpisodes);
        populate(newReleasesSlider, newReleases);
        populate(topRatedSlider, topRated);
        populate(addedSlider, addedToWebsite);
    }
    catch (err) {
        console.error("❌ Load Failed:", err);
        showError(trendingSlider);
        showError(newReleasesSlider);
        showError(topRatedSlider);
        showError(addedSlider);
    }
}

function showError(slider) {
    slider.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-circle"></i> Failed to load
        </div>
    `;
}

function populate(slider, data) {
    slider.innerHTML = "";

    if (!data || data.length === 0) {
        slider.innerHTML = `<div class="no-content">No content available</div>`;
        return;
    }

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "slider-item";

        div.innerHTML = `
            <img src="${item.thumbnail}" class="slider-img"
            onerror="this.src='https://via.placeholder.com/200x120?text=No+Image'">

            <div class="slider-content">
                <h3 class="slider-title">${item.title}</h3>
                <p class="slider-episode">⭐ ${item.rating ?? "N/A"}</p>
            </div>
        `;

        // ❌ CLICK REMOVE — NOW NON-CLICKABLE
        div.style.pointerEvents = "none";

        slider.appendChild(div);
    });
}

function setupSliders() {
    document.querySelectorAll(".slider").forEach(slider => {
        slider.style.overflowX = "auto";
        slider.style.scrollBehavior = "smooth";
    });
}

let searchOverlay, searchClose, searchTrigger, searchInputMain,
    searchResultsMain, searchResultGrid, resultCount;

function initSearch() {
    searchOverlay     = document.getElementById("searchOverlay");
    searchClose       = document.getElementById("searchClose");
    searchTrigger     = document.querySelector(".search-trigger");
    searchInputMain   = document.getElementById("searchInputMain");
    searchResultsMain = document.getElementById("searchResultsMain");
    searchResultGrid  = document.getElementById("searchResultGrid");
    resultCount       = document.getElementById("resultCount");

    if (!searchTrigger) return;

    searchTrigger.addEventListener("click", () => {
        searchOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        searchInputMain.value = "";
        searchInputMain.focus();
    });

    searchClose.addEventListener("click", () => {
        searchOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    });

    searchInputMain.addEventListener("input", () => {
        const q = searchInputMain.value.toLowerCase().trim();
        if (!q) {
            searchResultsMain.classList.remove("active");
            return;
        }

        const results = allEpisodes.filter(ep =>
            ep.title?.toLowerCase().includes(q)
        );

        showSearch(results);
    });
}

function showSearch(results) {
    searchResultGrid.innerHTML = "";

    if (!results.length) {
        searchResultGrid.innerHTML = `<div class="no-results">No result found</div>`;
        resultCount.textContent = "";
        return;
    }

    resultCount.textContent = `Found ${results.length} results`;

    results.forEach(item => {
        const div = document.createElement("div");
        div.className = "search-result-item-side";

        div.innerHTML = `
            <div class="result-thumbnail-side">
                <img src="${item.thumbnail}" class="result-img-side">
                <div class="episode-badge-side">Ep ${item.episode || "-"}</div>
            </div>

            <div class="result-info-side">
                <div class="result-title-side">${item.title}</div>
                <div class="result-episode-side">${item.episode}</div>
                <div class="result-description-side">${item.description}</div>
            </div>
        `;

        div.addEventListener("click", () => {
            if (item.slug) window.location.href = `episode.html?ep=${item.slug}`;
        });

        searchResultGrid.appendChild(div);
    });

    searchResultsMain.classList.add("active");
}