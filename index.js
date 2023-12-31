// Initialize and add the map
let map;
let markers = [];
let createdMarkers = []; // Keep track of created markers

// Create a template pinImg element
const pinImgTemplate = document.createElement("img");
pinImgTemplate.src = "./pin.png";
pinImgTemplate.width = "30";
pinImgTemplate.height = "30";

async function initMap() {
  // The location of Brasov
  const position = { lat: 45.6524781, lng: 25.5964628 };

  // Request needed libraries
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Brasov
  map = new Map(document.getElementById("map"), {
    zoom: 13,
    center: position,
    mapId: "Basketball_Map",
  });

  try {
    const response = await fetch('https://basketball-app-production.up.railway.app/api/v1/courts/search');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    markers = await response.json();
    // Create markers for each item in the 'markers' array
    createdMarkers = markers.map((markerData) => {
      const pinImg = pinImgTemplate.cloneNode(true);

      const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: markerData.coordinates.latitude, lng: markerData.coordinates.longitude },
        title: markerData.name,
        content: pinImg,
      });
      marker.setAttribute('data-type', markerData.courtType);
      marker.setAttribute('data-state', markerData.renovationStatus);

      return marker;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const selectTeren = document.getElementById("selectTeren");
const selectType = document.querySelector("#selectType");
const selectState = document.querySelector("#selectState");
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedValue = selectTeren.value;
  const selectedType = selectType.value;
  const selectedState = selectState.value;

  createdMarkers.forEach((marker) => {
    marker.setMap(null);
  });

  const filteredMarkers = createdMarkers.filter((marker) => {
    return (
      (selectedValue === "" || marker.title === selectedValue) &&
      (selectedType === "" || marker.getAttribute('data-type') === selectedType) &&
      (selectedState === "" || marker.getAttribute('data-state') === selectedState)
    );
  });

  if (filteredMarkers.length > 0) {
    // Center the map on the first matching marker
    const firstMatchingMarker = filteredMarkers[0];
    map.setCenter(firstMatchingMarker.position);
    // Afișează toți marcatorii care corespund selecțiilor
    filteredMarkers.forEach((marker) => {
      marker.setMap(map);
    });
  }
});

initMap();