import React, { useState } from 'react';

interface NewTableModalProps {
  onClose: () => void;
  onCreateTable: (name: string) => void;
}

export const NewTableModal: React.FC<NewTableModalProps> = ({ onClose, onCreateTable }) => {
  const [tableName, setTableName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableName.trim()) return;
    onCreateTable(tableName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">New Game</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="Game Name"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
            required
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
