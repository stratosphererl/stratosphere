import { useRouteError } from "react-router-dom";

export default function Error(props: {message: string}) {
  const error = useRouteError();

  return (
    <div>
      <div>error.tsx</div>
      <p>{props.message}</p>
      {/* <p>{error.statusText || error.message}</p> */}
    </div>
  );
}