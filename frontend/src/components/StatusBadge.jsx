
export default function StatusBadge({ status }) {
  const classNames = {
    Pending: "badge-pending",
    Accepted: "badge-accepted",
    Rejected: "badge-rejected",
    Completed: "badge-completed",
  };

  return (
    <span className={classNames[status] || "badge-pending"}>
      {status}
    </span>
  );
}
