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

const normalizePolygonCenter = (
  latlngs: L.LatLng | L.LatLng[] | L.LatLng[][] | L.LatLng[][][]
): L.LatLng => {
  if (Array.isArray(latlngs)) {
    let current = latlngs;

    while (Array.isArray(current[0])) {
      current = current[0]; // iç içe diziye git
    }

    return current[0] as L.LatLng;
  }

  return latlngs;
};


const MapWithDraw = ({ onSelect }: { onSelect: Props["onSelect"] }) => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems); // 🔥 edit ve remove için şart

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {},
        circle: {},
        rectangle: false,
        polyline: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    const handleCreated = (e: any) => {
      const layer = e.layer;
      drawnItems.addLayer(layer);

      if (e.layerType === "circle") {
        const center = layer.getLatLng();
        const radius = layer.getRadius();
        onSelect({ lat: center.lat, lng: center.lng, radius });
      }

      if (e.layerType === "polygon") {
        const latlngs = layer.getLatLngs();
        const point = normalizePolygonCenter(latlngs);
        onSelect({ lat: point.lat, lng: point.lng, radius: 0 });
      }
    };

    const handleEdited = (e: any) => {
      e.layers.eachLayer((layer: any) => {
        if (layer instanceof L.Circle) {
          const center = layer.getLatLng();
          const radius = layer.getRadius();
          onSelect({ lat: center.lat, lng: center.lng, radius });
        }

        if (layer instanceof L.Polygon) {
          const latlngs = layer.getLatLngs();
          const point = normalizePolygonCenter(latlngs);
          onSelect({ lat: point.lat, lng: point.lng, radius: 0 });
        }
      });
    };

    const handleDeleted = (e: any) => {
      console.log("Silinen şekil sayısı:", e.layers.getLayers().length);
      onSelect({ lat: 0, lng: 0, radius: 0 }); // Temizlenmiş konum
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);
    map.on(L.Draw.Event.DELETED, handleDeleted);

    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.off(L.Draw.Event.DELETED, handleDeleted);
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
      title="🗺️ Haritada Alan Seç"
      destroyOnClose
      width={1000}
      style={{ top: 24 }}
      bodyStyle={{ height: "70vh", padding: 0 }}
    >
      <MapContainer
        center={[39.9208, 32.8541]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapWithDraw onSelect={onSelect} />
      </MapContainer>
    </Modal>
  );
};

export default FloatingMapSelector;
