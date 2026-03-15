import React from "react";
import { updateTask } from "../api";
import "./TaskCard.css";

const STATUS_LABELS = {
  todo: "To Do",
  inprogress: "In Progress",
  completed: "Completed",
};

export default function TaskCard({ task, onUpdate, currentUserId }) {
  const assignedUserId = task.assignedTo?._id?.toString();
  const userId = currentUserId?.toString();

  const canChangeStatus = assignedUserId === userId;

  const handleStatusChange = async (newStatus) => {
    if (!canChangeStatus) return;

    try {
      await updateTask(task._id, {
        status: newStatus,
      });

      onUpdate();
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  return (
    <div className={`tcard tcard--${task.status}`}>
      <div className="tcard-title">{task.title}</div>

      {task.assignedTo && (
        <div className="tcard-assigned">
          <span className="tcard-avatar">
            {task.assignedTo.fullName?.[0]?.toUpperCase()}
          </span>

          {task.assignedTo.fullName}
        </div>
      )}

      <div className="tcard-footer">
        <span className={`tcard-badge tcard-badge--${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>

        <select
          className="tcard-select"
          value={task.status}
          disabled={!canChangeStatus}
          title={
            !canChangeStatus
              ? "Only the assigned user can update this task"
              : ""
          }
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
