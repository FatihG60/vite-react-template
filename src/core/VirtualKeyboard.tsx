import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Card, Select, Typography } from "antd";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { keyboardLayouts } from "./keyboard/KeyboardLayouts";

type KeyboardLayoutKey = keyof typeof keyboardLayouts;

const { Text } = Typography;

interface FloatingKeyboardProps {
  onInput: (value: string) => void;
  initialValue?: string;
  onClose?: () => void;
}

const FloatingKeyboard = ({
  onInput,
  initialValue = "",
  onClose,
}: FloatingKeyboardProps) => {
  const [langKey, setLangKey] = useState<KeyboardLayoutKey>("turkish");
  const keyboardRef = useRef<any>(null);
  const draggableRef = useRef(null);
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );

  useEffect(() => {
    const handleFocus = (e: Event) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        activeInputRef.current = target;
        if (keyboardRef.current) {
          keyboardRef.current.setInput(target.value);
        }
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  const layoutConfig = keyboardLayouts[langKey];

  const handleChange = (input: string) => {
    const el = activeInputRef.current;
    if (el) {
      el.value = input;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      //if (typeof onInput === "function") onInput(input);
    }
  };

  return (
    <Draggable
      nodeRef={draggableRef}
      handle=".floating-keyboard-header"
      grid={[5, 5]}
    >
      <div
        ref={draggableRef}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 600,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="floating-keyboard-header"
          style={{
            cursor: "move",
            padding: "8px 16px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fafafa",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Text strong>Sanal Klavye</Text>
          {onClose && (
            <Text
              style={{ cursor: "pointer", color: "#ff4d4f" }}
              onClick={onClose}
            >
              ✕
            </Text>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <Select
            value={langKey}
            onChange={setLangKey}
            virtual={false}
            style={{ marginBottom: 12, width: 250 }}
            options={Object.entries(keyboardLayouts).map(([key, val]) => ({
              value: key,
              label: val.name,
            }))}
          />
          <Keyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            layout={layoutConfig.layout}
            layoutName="default"
            onChange={handleChange}
          />
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingKeyboard;
