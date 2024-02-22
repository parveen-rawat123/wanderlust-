mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: "map", 
style : "mapbox://styles/mapbox/streets-v12",
center: ([77.2090,28.6139]),  
zoom: 9 
});
 console.log(coordinates)
const marker = new mapboxgl.Marker({color : "red"})
.setLngLat(coordinates)
.addTo(map);

