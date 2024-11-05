import React, { useState } from 'react';
import { Trophy, Clock, Lock, CheckCircle } from 'lucide-react';
import { Task } from '../types';

interface StudentDashboardProps {
  tasks: Task[];
  username: string;
  leaderboard: Array<{
    studentName: string;
    taskId: string;
    time: number;
  }>;
  onSolveTask: (studentName: string, taskId: string, time: number) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  tasks,
  username,
  leaderboard,
  onSolveTask,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [answer, setAnswer] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setAnswer('');
    setError('');
    setStartTime(Date.now());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !startTime) return;

    if (answer.toLowerCase() === selectedTask.plaintext.toLowerCase()) {
      const timeTaken = (Date.now() - startTime) / 1000; // Convert to seconds
      onSolveTask(username, selectedTask.id, timeTaken);
      setSelectedTask(null);
      setAnswer('');
      setStartTime(null);
    } else {
      setError('Incorrect answer. Try again!');
    }
  };

  const formatTime = (seconds: number): string => {
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Task List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Decryption Challenges
          </h2>
          <div className="grid gap-4">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => handleTaskSelect(task)}
                className={`p-4 border rounded-lg text-left hover:bg-gray-50 transition-colors ${
                  selectedTask?.id === task.id ? 'border-indigo-500 bg-indigo-50' : ''
                }`}
              >
                <p className="font-medium">Encrypted Text: {task.encrypted}</p>
                <p className="text-sm text-gray-600">Rule: Shift {task.rule} positions</p>
              </button>
            ))}
          </div>
        </div>

        {selectedTask && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Solve Challenge</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Answer
                </label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter decrypted text"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Submit Answer
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Leaderboard
        </h2>
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div
              key={`${entry.studentName}-${entry.taskId}-${entry.time}`}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-gray-500' :
                  index === 2 ? 'text-amber-600' :
                  'text-gray-600'
                }`}>
                  #{index + 1}
                </span>
                <span className="font-medium">{entry.studentName}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(entry.time)}</span>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <p className="text-gray-500 text-center py-4">No solutions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;