import logo from "../../assets/logo/700.png"

export default function MainPane({title, className, children}: {title: string, className: string, children: React.ReactNode}) {
    return (
        <main className={`${className} round glass-outer p-10 m-auto border-white`}>
            <div className="flex mb-4">
                {/* Ignore right margin for other elements*/}
                <img className={`max-h-[52px] max-w-[52px] mr-[-52px]`} src={logo}/>
                <h1 className="font-bold m-auto">{title}</h1>
            </div>
            <div>
                {children}
            </div>
        </main>
    )
}