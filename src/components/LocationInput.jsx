
import PropTypes from "prop-types";

export default function LocationInput({ start, end, setStart, setEnd, fetchCoordinates, getRoute }) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
                type="text"
                placeholder="Start Location"
                className="border p-3 w-full rounded-lg"
                value={start}
                onChange={(e) => {
                    setStart(e.target.value);
                    console.log(e.target.value);
                }}
                onBlur={() => fetchCoordinates(start, 'start')}
            />
            <input
                type="text"
                placeholder="End Location"
                className="border p-3 w-full rounded-lg"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                onBlur={() => fetchCoordinates(end, 'end')}
            />
            <button
                onClick={getRoute}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
                Get Route
            </button>
        </div>
    );
}

LocationInput.propTypes = {
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    setStart: PropTypes.func.isRequired,
    setEnd: PropTypes.func.isRequired,
    fetchCoordinates: PropTypes.func.isRequired,
    getRoute: PropTypes.func.isRequired,
};