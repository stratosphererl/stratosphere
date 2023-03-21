import "./error.css";
import errorImage from "../../assets/images/sad_strawberry.png";

export default function Error({message} : {message: string}) {
  return (
    <div className="error">
      <h1>ERROR</h1>
      <img className="error-image" src={errorImage} alt="sad strawberry" />
      <h3 className="font-bold">An unexpected error has occured:</h3>
      <p>{message}</p>
    </div>
  );
}