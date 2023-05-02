import { useParams } from "react-router-dom";
import Header from "./Header/header";
import Footer from "./Footer/footer";

export default function HeaderFooterWrapper(props: {
  background: string;
  children: JSX.Element;
  callPage: string;
}) {
  const params = useParams();
  let classname = "";

  if (params.version === "0") {
    classname = `${props.background}-general`;
  } else if (params.version === "1") {
    classname = `${props.background}-personal`;
  } else {
    classname = `${props.background}`;
  }

  if (props.background !== "") addImageClassToBody(classname);

  // TODO: Dynamically use wrapper-background depending on whether in darkmode (show) or lightmode (don't show)
  // CONSIDER: Are there pages not to use wrapper-background on even in darkmode?
  if (props.callPage !== "Home") {
    return (
      <div
        style={{ minHeight: "100vh" }}
        className="wrapper-background flex flex-col"
      >
        <Header />
        {props.children}
        <Footer isHome={false} />
      </div>
    );
  } else {
    return (
      <div
        style={{ minHeight: "100vh" }}
        className="wrapper-background flex flex-col"
      >
        <Header />
        {props.children}
        <Footer isHome={true} />
      </div>
    );
  }
}

function addImageClassToBody(className: string) {
  const inheritedClass = "background";
  document.body.classList.add(inheritedClass, className);
}
