import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const CookingSessionComponent = ({
    recipeId,
    socketRef,
    userId,
    chefId,
    connected,
}) => {
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(null);
    const [stepInput, setStepInput] = useState("");

    const isChefOwner = userId === chefId;

    const fetchSteps = async (id) => {
        try {
            console.log("Fetching steps for recipe:", id);
            const res = await axios.get(`/cooking/${id}`);
            setSteps(res.data);
        } catch (err) {
            console.error("Error fetching steps:", err);
        }
    };

    useEffect(() => {
        if (!recipeId) return;

        fetchSteps(recipeId);

        if (socketRef?.current && socketRef.current.connected) {
            console.log("Joining session:", recipeId);
            socketRef.current.emit("JOIN_SESSION", { sessionId: recipeId });
        } else {
            console.warn("Socket not connected, cannot join session");
        }

        const handleStepUpdate = ({ step, by, at }) => {
            console.log("Received step update:", { step, by, at });
            const newStep = {
                step,
                by: by || "Chef",
                at: at || new Date().toISOString(),
            };
            setSteps((prev) => [...prev, newStep]);
            setCurrentStep(newStep.step);
        };

        socketRef?.current?.on("step-update", handleStepUpdate);

        return () => {
            socketRef?.current?.off("step-update", handleStepUpdate);
        };
    }, [recipeId]);

    const sendStep = () => {
        if (!stepInput.trim()) return;

        console.log("Trying to send step:", stepInput);

        if (!socketRef.current) {
            console.warn("No socket instance found!");
            return;
        }
        if (!socketRef.current.connected) {
            console.warn("Socket not connected! Can't send step.");
            return;
        }

        socketRef.current.emit("cooking-step", {
            recipeId,
            step: stepInput.trim(),
        });

        console.log("Step sent:", stepInput.trim());

        setStepInput("");
    };

    return (
        <div className="bg-white rounded p-6 shadow mt-6">
            <h3 className="text-xl font-semibold mb-4">
                Live Steps for Recipe ID: {recipeId}
            </h3>

            {!connected && (
                <p className="text-red-600 mb-2 font-semibold">
                    ⚠️ Socket not connected yet — live updates unavailable
                </p>
            )}

            {steps.length === 0 ? (
                <p className="text-gray-500">No steps yet.</p>
            ) : (
                <ul className="space-y-2 mb-4 max-h-72 overflow-y-auto">
                    {steps.map((step, index) => (
                        <li
                            key={index}
                            className="border-b py-2 text-sm text-gray-700"
                        >
                            <strong>{step.step}</strong> — by {step.by} at{" "}
                            {new Date(step.at).toLocaleString()}
                        </li>
                    ))}
                </ul>
            )}

            {currentStep && (
                <div className="mt-2 text-green-700">
                    ✅ Current Step: <strong>{currentStep}</strong>
                </div>
            )}

            {/* Step Input for Chef Owner */}
            {isChefOwner && (
                <div className="mt-6">
                    <h4 className="text-md font-semibold mb-2">
                        Send a new step
                    </h4>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={stepInput}
                            onChange={(e) => setStepInput(e.target.value)}
                            placeholder="Describe the next step..."
                            className="border rounded px-3 py-2 w-full"
                        />
                        <button
                            onClick={sendStep}
                            disabled={!connected}
                            className={`px-4 py-2 rounded text-white ${
                                connected
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CookingSessionComponent;
