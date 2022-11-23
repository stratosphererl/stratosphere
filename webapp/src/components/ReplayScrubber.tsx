import marker from '../assets/temp_marker.png';

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
    return (
        <div className="w-full relative">
            <div className='flex w-full'>
                {
                    events.map((keyEvent) => 
                        <img style={{marginLeft: (keyEvent.time / endTime * 100) + "%"}} src={marker} width="5%"/>
                    )
                }
            </div>
            <input className="w-full" type="range" />
        </div>
    )
}