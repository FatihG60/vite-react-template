import { useEffect } from "react";
import { Modal } from "antd";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (data: { lat: number; lng: number; radius: number }) => void;
}
type MapWithDrawProps = {
  onSelect: (data: { lat: number; lng: number; radius: number }) => void;
};

const MapWithDraw = ({ onSelect }: MapWithDrawProps) => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: false,
        polyline: false,
        marker: false,
        rectangle: false,
        circlemarker: false,
        circle: {
          shapeOptions: {
            color: "#1677ff",
            fillColor: "#1677ff",
            fillOpacity: 0.4,
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    const onCreated = (e: any) => {
      drawnItems.clearLayers();
      const layer = e.layer;
      drawnItems.addLayer(layer);
      const center = layer.getLatLng();
      const radius = layer.getRadius();
      onSelect({ lat: center.lat, lng: center.lng, radius });
    };

    map.on(L.Draw.Event.CREATED, onCreated);

    setTimeout(() => {
      map.invalidateSize(); // zorunlu güncelleme
    }, 300);
    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);
      map.removeControl(drawControl);
    };
  }, [map, onSelect]);

  return null;
};

const FloatingMapSelector = ({ open, onClose, onSelect }: Props) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      destroyOnClose={false}
      title="🗺️ Haritada Alan Seç"
    >
      <MapContainer
        center={[39.9208, 32.8541]} // Türkiye merkez
        zoom={4}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapWithDraw onSelect={onSelect} />
      </MapContainer>
    </Modal>
  );
};

export default FloatingMapSelector;
