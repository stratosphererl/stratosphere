import "./loadingbar.css";

export default function LoadingBar({progress} : {progress: number}) {
    return (
        <div className={`loading-bar round`}>
            <div className="loading-bar-progress round" style={{width: `${progress}%`}} />
        </div>
    );
}