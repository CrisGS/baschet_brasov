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
    console.log(markers);
    // Create markers for each item in the 'markers' array
    createdMarkers = markers.map((markerData) => {
      const pinImg = pinImgTemplate.cloneNode(true);

      const marker = new AdvancedMarkerElement({
        map: map,
        position: { lat: markerData.coordinates.latitude, lng: markerData.coordinates.longitude },
        title: markerData.name,
        content: pinImg,
      });
      return marker;
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const selectTeren = document.getElementById("selectTeren");

selectTeren.addEventListener("input", (e) => {
  const selectedValue = e.target.value;

  // Hide all markers
  createdMarkers.forEach((marker) => {
    marker.setMap(null);
  });

  // Show only the selected marker
  const selectedMarker = createdMarkers.find((marker) => marker.title === selectedValue);
  if (selectedMarker) {
    map.setCenter(selectedMarker.position); // Center the map on the selected marker
    selectedMarker.setMap(map); // Show the selected marker on the map
  }
});

initMap();