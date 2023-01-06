import { useState } from 'react';
import marker from '../assets/temp_marker.png';
import '../styles/scrubber.css'

interface ScrubberProps {
    endTime?: number;
    events?: {
        eventType: number,
        time: number,
    }[];
}
export default function ReplayScrubber({
    endTime = 1,
    events = [],
}: ScrubberProps) {
    const [value, setValue] = useState(0);
    const [isPlaying, setPlaying] = useState(false);

    const MAX = endTime
    const getSytle = () => {
        return {
            height: "30px",
            backgroundSize: `${(value * 100) / MAX}% 100%`,
        };
    };
    
    return (
        <div className="w-full flex h-8">
            <button className="bg-stratosphere-blue w-1/12 rounded-sm" onClick={() => setPlaying(!isPlaying)}>
                <div className='font-bold'>
                    {isPlaying ? "Pause" : "Play"}
                </div>
            </button>
            <div className="w-full">
                <div className='mr-6 relative top-0.5'>
                    {
                        events.map((keyEvent) =>
                        <button className='absolute w-6 h-6 bg-no-repeat bg-contain'
                        style={{ left: (keyEvent.time / endTime * 100) + "%", backgroundImage: `url(${marker})`}} onClick={() => setValue(Math.max(keyEvent.time - 60, 0))} />
                        )
                    }
                </div>
                <div className='ml-3 mr-3'>
                    <input
                        type="range" min={0} max={MAX} value={value}
                        style={getSytle()}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(Number(e.target.value))}
                        />
                </div>
            </div>
        </div>
    )
}