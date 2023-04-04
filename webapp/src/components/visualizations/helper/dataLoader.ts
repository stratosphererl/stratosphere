import JSZip from "jszip";
import { usePapaParse } from "react-papaparse";
import { useEffect, useState } from "react";

export const useReplayFrames = (url: string) => {
  const [data, setData] = useState<any>({ positions: [], rotations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { readString } = usePapaParse();

  useEffect(() => {
    let isMounted = true;
    const zip = new JSZip();
    fetch(url
      // mode: "cors",
      // credentials: "include",
      // headers: {
      //   "Access-Control-Allow-Origin": 'https://fastupload.io',
      //   "Access-Control-Allow-Credentials": "true",
      // },
    )
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          zip.loadAsync(buffer).then((zip) => {
            console.log(zip);
            zip
              .file("test.csv")
              .async("string")
              .then((data) => {
                if (isMounted) {
                  readString(data, {
                    complete: (results) => {
                      setData(parseReplayFrameData(results.data));
                      setLoading(false);
                    },
                  });
                }
              });
          });
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
  let headers_1 = data[0];
  let headers_2 = data[1];

  let positions_idx = [];
  let rotations_idx = [];

  let positions = [];
  let rotations = [];

  for (let i = 0; i < headers_2.length; i++) {
    if (headers_2[i].startsWith("pos_y") || headers_2[i].startsWith("pos_x")) {
      positions_idx.push(i);
    } else if (
      headers_2[i].startsWith("rot_y") ||
      headers_2[i].startsWith("rot_x")
    ) {
      rotations_idx.push(i);
    }
  }

  positions_idx = positions_idx.reduce(function (result, value, index, array) {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);

  rotations_idx = rotations_idx.reduce(function (result, value, index, array) {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);

  let pos = [];
  let rot = [];

  for (let i = 2; i < data.length; i++) {
    let row = data[i];
    let posframe = [];
    let rotframe = [];

    for (let j = 0; j < positions_idx.length; j++) {
      let x = row[positions_idx[j][0]];
      let y = row[positions_idx[j][1]];

      try {
        posframe.push([parseFloat(x), parseFloat(y)]);
      } catch (e) {
        posframe.push([0, 0]);
      }
    }

    pos.push(posframe);

    for (let j = 0; j < rotations_idx.length; j++) {
      let x = row[rotations_idx[j][0]];
      let y = row[rotations_idx[j][1]];

      try {
        rotframe.push([parseFloat(x), parseFloat(y)]);
      } catch (e) {
        rotframe.push([0, 0]);
      }
    }

    rot.push(rotframe);
  }

  return {
    positions: pos,
    rotations: rot,
  };
};
