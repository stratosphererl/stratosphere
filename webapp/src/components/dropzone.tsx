import { useState } from "react";
import Reveal from "./Reveal";

interface DropzoneProps {
  file: File | undefined;
  setFile: (file: File | undefined) => void;
  uploading: boolean;
}

export default function Dropzone({ file, setFile, uploading }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [invalidAction, setInvalidAction] = useState("");

  const announceInvalidAction = (action: string) => {
    setInvalidAction(action);

    setTimeout(() => {
      setInvalidAction("");
    }, 5000);
  };

  const validFile = (file: File): boolean => {
    const validExtensions = ["replay"];
    const extension = file.name.split(".").pop();
    if (!extension) return false;
    return validExtensions.includes(extension);
  };

  const manyFiles = (files: FileList): boolean => {
    return files.length > 1;
  };

  const handleFileChange = (files: FileList) => {
    if (uploading) return;
    if (file) setFile(undefined);

    if (manyFiles(files))
      return announceInvalidAction(
        "Too many files. Please only upload one file at a time."
      );

    const newFile = files[0];
    if (!validFile(newFile))
      return announceInvalidAction("Invalid file type. Must be a .replay file");
    setFile(newFile);
  };

  const handleDragOver = (ev: React.DragEvent<HTMLDivElement>): void => {
    if (uploading) return;
    ev.preventDefault();
    setDragging(true);
    setInvalidAction("");
  };

  const handleDragLeave = (ev: React.DragEvent<HTMLDivElement>): void => {
    if (uploading) return;
    ev.preventDefault();
    setDragging(false);
    setInvalidAction("");
  };

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>): void => {
    if (uploading) return;
    ev.preventDefault();
    setDragging(false);

    handleFileChange(ev.dataTransfer.files);
  };

  const handleClick = () => {
    if (uploading) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".replay";
    input.onchange = (ev) =>
      handleFileChange((ev.target as HTMLInputElement).files!);
    input.click();
  };

  return (
    <div
      style={{ cursor: `${!uploading ? "pointer" : "wait"}` }}
      className="dropzone glass-inner-light w-full h-[300px] round mt-10 alpha-dark-border text-center flex justify-center items-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      {invalidAction ? (
        <Reveal on={invalidAction}>
          <p>{invalidAction}</p>
        </Reveal>
      ) : dragging ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-file-upload"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#ffffff"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />{" "}
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />{" "}
          <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />{" "}
          <line x1="12" y1="11" x2="12" y2="17" />{" "}
          <polyline points="9 14 12 11 15 14" />{" "}
        </svg>
      ) : file ? (
        <Reveal on={file}>
          <p>{file.name}</p>
        </Reveal>
      ) : (
        <div>
          <div className="mb-5">
            <p>Click here to select your replay file</p>
            <p>-- OR --</p>
            <p>Drag & Drop your replay file</p>
          </div>
          <div>
            <p>Replays are usually found at the following:</p>
            <p>{`C:\\Users\\<user>\\Documents\\My Games\\Rocket League\\TAGame\Demos`}</p>
          </div>
        </div>
      )}
    </div>
  );
}
