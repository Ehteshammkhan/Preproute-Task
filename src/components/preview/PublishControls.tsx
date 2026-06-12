import { useState } from "react";
import { Button } from "../ui";

interface PublishControlsProps {
  isPublishing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function PublishControls({
  isPublishing,
  onCancel,
  onConfirm,
}: PublishControlsProps) {
  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [liveUntil, setLiveUntil] = useState("always");

  return (
    <>
      <div className="mt-6 inline-flex rounded-lg border border-gray-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setPublishMode("now")}
          className={`rounded-md px-5 py-2 text-sm font-medium ${
            publishMode === "now" ? "bg-blue-50 text-blue-700" : "text-gray-400"
          }`}
        >
          Publish Now
        </button>

        <button
          type="button"
          onClick={() => setPublishMode("schedule")}
          className={`rounded-md px-5 py-2 text-sm font-medium ${
            publishMode === "schedule"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-400"
          }`}
        >
          Schedule Publish
        </button>
      </div>

      {publishMode === "schedule" && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Select Date and Time
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="date"
              className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none"
            />

            <input
              type="time"
              className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none"
            />
          </div>
        </div>
      )}

      <div className="mt-7">
        <h3 className="text-sm font-semibold text-gray-800">Live Until</h3>

        <p className="mt-2 text-sm text-gray-500">
          Choose how long this test should remain available on the platform.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-y-5 md:grid-cols-2">
          {[
            ["always", "Always Available"],
            ["3weeks", "3 Weeks"],
            ["1week", "1 Week"],
            ["1month", "1 Month"],
            ["2weeks", "2 Weeks"],
            ["custom", "Custom Duration"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              <input
                type="radio"
                checked={liveUntil === value}
                onChange={() => setLiveUntil(value)}
                className="h-4 w-4"
              />
              {label}
            </label>
          ))}
        </div>

        {liveUntil === "custom" && (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="date"
              className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none"
            />

            <input
              type="time"
              className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none"
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button
          type="button"
          className="w-auto bg-gray-100 px-10 text-blue-600 hover:bg-gray-200"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="button"
          className="w-auto px-10"
          loading={isPublishing}
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </div>
    </>
  );
}

export default PublishControls;
