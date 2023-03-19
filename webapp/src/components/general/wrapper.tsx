import { useParams } from 'react-router-dom';
import Header from "./Header/header"
import Footer from "./footer"

export default function HeaderFooterWrapper(props: {background: string, children: JSX.Element[]}) {
    const params = useParams();
    let classname = "";

    if (params.version === "0") {
        classname = `${props.background}-general`
    } else if (params.version === "1") {
        classname = `${props.background}-personal`
    } else {
        classname = `${props.background}`
    }

    if(props.background !== "") 
        addImageClassToBody(classname);

    return (
        <div style={{}}>
            <Header />
            {props.children}
            <Footer />
        </div>
    );
}

function addImageClassToBody(className : string) {
    const inheritedClass = "background";
    document.body.style.setProperty('--curr-bg', className);
    document.body.classList.add(inheritedClass, className);
}