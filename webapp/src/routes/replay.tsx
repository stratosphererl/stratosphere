import { useParams } from 'react-router-dom';
import PieChart from '../components/visualizations/pie';

const pieData = [
    { name: "Steam", value: 12000, color: "rgb(41, 90, 140)" }, // Color doesn't have to be rgb, can also be hex, color name, or css variable
    { name: "Epic", value: 8000, color: "rgb(50, 50, 50)" },
]

export default function Replay() {
    const params = useParams();
    const regex = /^[A-Z0-9]{32}$/

    if (!regex.test(params.replayid!)) {
      // return <ErrorPage message = "Replay ID parameter must follow regex [A-Z0-9]{32}"/>;
        throw new Error("Replay ID parameter must follow regex [A-Z0-9]{32}");
    }

    return (
      <div>
        <h1 className="text-center">Steam and Epic Users</h1>
        <PieChart // You may need to refresh page to see changes
            className="w-[10%] m-auto" // Stylings
            data={pieData} // Data follows the pattern above, you can also look at the pie.tsx file
            disableTooltip={false} // Optional: Disables tooltip, false by default
            disableOpacity={false} // Optional: Disables opacity, false by default (opacity is set to 0.9 by default and changes to 1 on hover)
        />
      </div>
    );
}