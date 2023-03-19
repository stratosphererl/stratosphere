import { useContext } from "react"
import { useParams } from 'react-router-dom';
import { WindowContext } from "../../context/contexts"
import Header from "./header"
import Footer from "./footer"

export default function HeaderFooterWrapper(props: {pageHeight: number, background: string, children: JSX.Element}) {
    const params = useParams();
    let classname = "";

    if (params.version === "0") {
        classname = `${props.background}-general`
    } else if (params.version === "1") {
        classname = `${props.background}-personal`
    } else {
        classname = `${props.background}`
    }

    const window = useContext(WindowContext)

    const windowWidth = window.currDims.width
    console.log(windowWidth)

    const currZoom = windowWidth / 1920

    return (
        <div className={classname} style={{height: props.pageHeight, width: 1912, zoom: currZoom}}>
            <Header />
            {props.children}
            <Footer />
        </div>
    );
}