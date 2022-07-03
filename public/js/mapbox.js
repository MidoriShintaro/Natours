import mapboxgl from "mapbox-gl";

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2lyaWhpdG8iLCJhIjoiY2w0bmwwbXE0MTl1ZzNmbzF1NGI1c3gwNiJ9.P1qzsK0e-XPeeAi5WeGuIg";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/kirihito/cl4nqq89l000914pllc2bc8b7",
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
