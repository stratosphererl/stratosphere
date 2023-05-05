import JSZip from "jszip";
import { usePapaParse } from "react-papaparse";
import { useEffect, useState } from "react";

export const useReplayFrames = (url: string) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { readString } = usePapaParse();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);

    let isMounted = true;
    const zip = new JSZip();
    fetch(url)
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          zip.loadAsync(buffer).then((zip) => {
            const zip_object = zip.file(Object.keys(zip.files)[0]);
            if (!zip_object) throw new Error("No file found in zip");
            zip_object.async("string")
              .then((data) => {
                if (isMounted) {
                  readString(data, {
                    complete: (results) => {
                      setData(parseReplayFrameData(results.data));
                      setLoading(false);
                    },
                    worker: true
                  });
                }
              }).catch((err) => {
                if (isMounted) {
                  setError(err);
                  setLoading(false);
                }
              });
          });
        }).catch((err) => {
          if (isMounted) {
            setError(err);
            setLoading(false);
          }
        });
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url, readString]);

  return { data, loading, error };
};

const parseReplayFrameData = (data: any) => {
  let actorHeaders = data[0];
  let attributeHeaders = data[1];

  const frames = [];

  // create a map of actor names to indices
  const actorMap = new Map();

  for (let i = 0; i < actorHeaders.length; i++) {
    actorMap.set(actorHeaders[i], i);
  }

  for (let i = 2; i < data.length; i++) {
    const frame = data[i];

    let previousIdx = 0;

    let dataActor = [];

    let actorID = 0;

    for (let actor of actorMap) {
      let [name, endIdx] = actor;

      const entity: any = {
        id: actorID++,
        name,
        type: name === "game" ? "game" : name === "ball" ? "ball" : "player",
      };
      const actorFrameSlice = frame.slice(previousIdx, ++endIdx);
      const actorData = actorFrameSlice.map((d: any) =>
        !isNaN(d)
          ? Boolean(!Number.isNaN(parseFloat(d)))
            ? parseFloat(d)
            : Infinity
          : d === "FALSE" || d === "TRUE"
          ? JSON.parse(d.toLowerCase())
          : d
      );

      if (name === "ball") {
        entity["position"] = {
          x: actorData[0],
          y: actorData[1],
          z: actorData[2],
        };

        entity["velocity"] = {
          x: actorData[3],
          y: actorData[4],
          z: actorData[5],
        };
      } else if (name === "game") {
        entity["seconds_remaining"] = actorData[0];
      } else {
        entity["position"] = {
          x: actorData[2],
          y: actorData[3],
        };

        entity["velocity"] = {
          x: actorData[4],
          y: actorData[5],
        };

        entity["rotation"] = {
          y: actorData[4],
        };

        entity["boost"] = {
          amount: actorData[0],
          active: actorData[1],
        };
      }
      dataActor.push(entity);
      previousIdx = endIdx;
    }
    frames.push(dataActor);
    dataActor = [];
  }
  return frames;
};
