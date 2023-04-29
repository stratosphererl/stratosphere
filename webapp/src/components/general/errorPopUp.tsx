import { Popup } from "./PopUp/popup";

export function ErrorPopUp({ error, ...props }: any) {
  return (
    <Popup
      title="Replay Upload Error"
      subtitle="👷 Error, error, on the wall, please send it to a dev, once and for all!"
      {...props}
    >
      <p className="font-mono warning-bright-red max-h-[400px] overflow-y-scroll">
        {error}
      </p>
    </Popup>
  );
}
