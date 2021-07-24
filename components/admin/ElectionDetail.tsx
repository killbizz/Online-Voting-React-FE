import { Election } from "../../classes/Election";

interface ElectionDetailProps {
    election: Election
}

const ElectionDetail = ({ election }: ElectionDetailProps) => {
    return (
        <button className="btn btn-sm btn-secondary mr-2">Details</button> 
    );
}

export default ElectionDetail;