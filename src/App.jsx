import React, { useState, useEffect } from "react";
import "./App.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { FaInfoCircle, FaRedo } from "react-icons/fa"; // Іконки з FontAwesome
import { CiCalculator1 } from "react-icons/ci";

function App() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [routeInfo, setRouteInfo] = useState("");

  // Міста з їхніми координатами
  const cities = {
    Тернопіль: [49.5554, 25.5948],
    Львів: [49.8397, 24.0297],
    Одеса: [46.4825, 30.7233],
    Харків: [49.9935, 36.2304],
    Дніпро: [48.4647, 35.0462],
    Запоріжжя: [47.848, 35.097],
    Черкаси: [49.4444, 32.059],
    Вінниця: [49.2328, 28.4682],
    Чернівці: [48.2924, 25.9377],
    Миколаїв: [46.975, 31.9946],
    Житомир: [50.4505, 28.6582],
    Суми: [50.9077, 34.7991],
    Хмельницький: [49.4196, 27.0005],
    Київ: [50.4501, 30.5234],
  };

  const handleRouteCalculation = () => {
    if (!departure || !arrival || departure === arrival) {
      alert("Будь ласка, оберіть різні місця вибуття та прибуття.");
      return;
    }
    setRouteInfo(`Маршрут між ${departure} та ${arrival}`);
  };

  const handleClearSelection = () => {
    setDeparture("");
    setArrival("");
    setRouteInfo("");
  };

  // Компонент, що малює маршрут на карті
  const Routing = ({ departure, arrival }) => {
    const map = useMap();

    useEffect(() => {
      if (departure && arrival) {
        const start = cities[departure];
        const end = cities[arrival];

        if (start && end) {
          // Очищаємо попередні маршрути та маркери на карті
          map.eachLayer((layer) => {
            if (layer instanceof L.Routing.Control) {
              map.removeLayer(layer); // Видаляємо попередні маршрути
            }
            if (layer instanceof L.Marker) {
              map.removeLayer(layer); // Видаляємо попередні маркери
            }
          });

          // Створюємо маршрут між точками
          const routeControl = L.Routing.control({
            waypoints: [L.latLng(start), L.latLng(end)],
            createMarker: () => null, // Не створюємо маркери для маршруту
            routeWhileDragging: true, // Дозволяємо змінювати маршрут перетягуванням
            autoRoute: true,
            lineOptions: {
              styles: [
                {
                  color: "blue",
                  weight: 4,
                  opacity: 0.7,
                },
              ],
            },
          }).addTo(map);

          // Додаємо маркери на початок і кінець маршруту
          const startMarker = L.marker(start, {
            icon: L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              iconSize: [25, 41],
            }),
          })
            .addTo(map)
            .bindPopup(`${departure} (початок)`)
            .setIcon(
              L.icon({
                iconUrl:
                  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              })
            );

          const endMarker = L.marker(end, {
            icon: L.icon({
              iconUrl:
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              iconSize: [25, 41],
            }),
          })
            .addTo(map)
            .bindPopup(`${arrival} (кінець)`)
            .setIcon(
              L.icon({
                iconUrl:
                  "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              })
            );

          return () => {
            // Очистка, коли маршрут змінюється
            routeControl.remove();
            startMarker.remove();
            endMarker.remove();
          };
        }
      }
    }, [departure, arrival]);

    return null;
  };

  return (
    <div className="App">
      <div className="form-container">
        <h2>Планування маршруту</h2>
        <label>Місце вибуття:</label>
        <select
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        >
          <option value="">Оберіть місто</option>
          {Object.keys(cities).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>Місце прибуття:</label>
        <select value={arrival} onChange={(e) => setArrival(e.target.value)}>
          <option value="">Оберіть місто</option>
          {Object.keys(cities).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button onClick={handleRouteCalculation}>
          <CiCalculator1 /> Розрахувати маршрут
        </button>
        <button onClick={handleClearSelection}>
          <FaRedo /> Очистити вибір
        </button>
        <p>{routeInfo}</p>

        {/* Додатковий блок з інформацією */}
        <div className="additional-info">
          <FaInfoCircle />
          <p>
            Ви можете вибрати два міста з запропонованого списку для того, щоб
            побудувати маршрут між ними. Натисніть "Розрахувати маршрут", щоб
            побачити деталі маршруту на карті. Кожен маршрут буде автоматично
            відображений з початковими та кінцевими маркерами.
          </p>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[50.4501, 30.5234]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Routing departure={departure} arrival={arrival} />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
