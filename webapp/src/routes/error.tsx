import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <div>error.tsx</div>
      <p>Unexpected error occured</p>
      <p>{error.statusText || error.message}</p>
    </div>
  );
}