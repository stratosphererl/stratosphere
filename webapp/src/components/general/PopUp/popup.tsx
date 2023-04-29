import { useState } from "react";
import "./popup.css";

export interface PopupProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  reveal?: boolean;
}

export function Popup(props: PopupProps) {
  const [show, setShow] = useState(props.reveal || false);

  const onCloseEvent = () => {
    setShow(false);
    if (props.onClose) props.onClose();
  };

  return show ? (
    <div>
      <div className="back-drop"></div>
      <div className={`popup round max-w-[1000px] ${props.className}`}>
        <div className="flex justify-end">
          <button onClick={onCloseEvent} className="cross-mark"></button>
        </div>
        <div className="mt-[-2rem]">
          <h1 className="text-center p-5 mb-[-15px]">{props.title}</h1>
          <h2 className="text-center p-1 mb-[-15px] font-normal">
            {props.subtitle}
          </h2>
          <div className="p-5">{props.children}</div>
        </div>
      </div>
    </div>
  ) : null;
}
