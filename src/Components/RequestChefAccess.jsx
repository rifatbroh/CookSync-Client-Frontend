import axios from "../utils/axios";

export default function RequestChefAccess() {
    const request = async () => {
        try {
            const res = await axios.post("/users/request-chef");
            alert(res.data.message);
        } catch (err) {
            alert("Request failed");
        }
    };

    return (
        <button
            onClick={request}
            className="bg-purple-600 text-white p-2 rounded"
        >
            Request Chef Access
        </button>
    );
}
