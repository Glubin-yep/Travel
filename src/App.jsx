import React, { useState, useEffect } from "react";
import "./App.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { FaQuestionCircle, FaInfoCircle, FaRedo } from "react-icons/fa"; // Іконки з FontAwesome
import { CiCalculator1 } from "react-icons/ci";

function App() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [routeInfo, setRouteInfo] = useState("");
  const [showHelp, setShowHelp] = useState(false); // Стан для модального вікна

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

  const toggleHelpModal = () => {
    setShowHelp(!showHelp);
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
      {showHelp && (
        <div className="help-modal">
          <div className="help-content">
            <h3>Довідка</h3>
            <p>
              <strong>Як користуватися програмою:</strong>
            </p>
            <ol>
              <li>
                <strong>Виберіть міста відправлення та прибуття:</strong>
                <ul>
                  <li>
                    У верхній частині екрана є два випадаючі списки. Перший
                    список — це
                    <em>Місце вибуття</em>. Виберіть місто, з якого ви хочете
                    почати маршрут.
                  </li>
                  <li>
                    Другий список — це <em>Місце прибуття</em>. Виберіть місто,
                    до якого ви хочете прокласти маршрут.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Розрахунок маршруту:</strong>
                Після вибору міст натисніть кнопку{" "}
                <em>"Розрахувати маршрут"</em>. На карті буде відображено
                прокладений маршрут між обраними містами, а також з’являться
                маркери початку та кінця маршруту.
              </li>
              <li>
                <strong>Очистка вибору:</strong>
                Якщо ви хочете почати заново, натисніть кнопку{" "}
                <em>"Очистити вибір"</em>. Всі ваші налаштування буде скинуто.
              </li>
              <li>
                <strong>Огляд маршруту на карті:</strong>
                Прокручуючи карту або змінюючи масштаб, ви можете детально
                переглянути маршрут, включаючи всі повороти та орієнтири.
              </li>
              <li>
                <strong>Інтерактивний маршрут:</strong>
                Ви можете перетягувати маршрут безпосередньо на карті, щоб
                змінити його або уточнити, якщо це потрібно.
              </li>
              <li>
                <strong>Що робити, якщо міста збігаються:</strong>
                Якщо ви обрали однакові міста для відправлення та прибуття,
                програма запропонує змінити вибір, оскільки маршрут у такому
                випадку неможливо прокласти.
              </li>
            </ol>
            <p>
              <strong>Додаткова інформація:</strong>
              Маршрут розраховується автоматично, включаючи оптимальні дороги
              для автомобілів. Ви також можете використовувати карту для інших
              маніпуляцій, наприклад переглядати інші міста або регіони.
            </p>
            <p>
              <strong>Поради:</strong>
              Якщо карта не відображається правильно, спробуйте оновити сторінку
              або перевірте інтернет-з’єднання. Для більшої зручності
              використовуйте програму на повноекранному режимі.
            </p>
            <button onClick={toggleHelpModal}>Закрити</button>
          </div>
        </div>
      )}

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
        <button onClick={toggleHelpModal}>
          <FaQuestionCircle /> Довідка
        </button>
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
