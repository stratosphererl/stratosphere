import "./login.css"

interface Label {
    value: string,
    backgroundColor?: string
}

interface Icon {
    backgroundColor?: string
}

export default function LoginButton({label, icon, children, onClick} : {label: Label, icon?: Icon, children: any, onClick?: () => void}) {
    return (
        <a onClick={onClick} className="login-btn">
            <div style={{backgroundColor: label.backgroundColor}} className={`text-xs`}>
                <span>{label.value}</span>
            </div>
            <div style={{backgroundColor: icon ? icon.backgroundColor : "rgb(41, 90, 140)"}}className="icon">
                {children}
            </div>
	    </a>
    );
}