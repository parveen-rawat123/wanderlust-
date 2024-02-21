mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: "map", 
style : "mapbox://styles/mapbox/streets-v12",
center: coordinates,  
zoom: 9 
});
 console.log(coordinates)
const marker = new mapboxgl.Marker({color : "red"})
.setLngLat(coordinates)
.setPopup(new mapboxgl.Popup({offset:25})
.setHTML("<h2>Hello World!</h2>"))
.addTo(map);

