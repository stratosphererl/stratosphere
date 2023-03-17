import { useParams } from 'react-router-dom';
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

    return (
        <div className={classname} style={{height: props.pageHeight, width: 1912}}>
            <Header />
            {props.children}
            <Footer />
        </div>
    );
}