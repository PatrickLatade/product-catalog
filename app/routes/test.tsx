import { useState } from "react";

export default function TestModalPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Modal Behavior Test</h1>

      <label htmlFor="test_modal" className="btn btn-primary">
        Open Modal
      </label>

      {/* DaisyUI Modal */}
      <input type="checkbox" id="test_modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
        <div className="modal-box bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
          <h3 className="font-bold text-lg">Hello from Test Modal!</h3>
          <p className="py-4">
            Try interacting with this modal to check if it duplicates or overlays.
          </p>

          <input
            type="text"
            placeholder="Type something"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input input-bordered w-full"
          />

          <div className="modal-action">
            <label htmlFor="test_modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </main>
  );
}
