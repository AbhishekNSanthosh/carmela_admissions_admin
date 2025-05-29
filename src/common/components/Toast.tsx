import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdError } from "react-icons/md";

interface ToastProps {
  type: "success" | "error" | "info"; // Added 'info' type
  showIcon?: boolean;
  message: string;
  desc?: string;
  toastId: string;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  toastId,
  desc,
  showIcon = false,
}) => {
  let backgroundColor;
  let textColor;

  switch (type) {
    case "success":
      backgroundColor = "bg-green-500";
      textColor = "text-white";
      break;
    case "error":
      backgroundColor = "bg-red-600";
      textColor = "text-white";
      break;
    case "info":
      backgroundColor = "bg-azure-600"; // Blue background for info
      textColor = "text-white";
      break;
    default:
      backgroundColor = "bg-gray-700"; // Fallback color
      textColor = "text-white";
  }

  return (
    <div
      className={`${
        toastId ? "animate-enter" : "animate-leave"
      } max-w-[310px] w-full ${backgroundColor} shadow-lg rounded-lg pointer-events-auto flex`}
    >
      <div className="flex-1 w-0 p-3">
        <div className="flex items-center">
          {showIcon && (
            <>
              {type === "error" ? (
                <MdError className="text-2xl text-white" />
              ) : (
                <IoCheckmarkCircle className="text-2xl text-white" />
              )}
            </>
          )}
          <div className="ml-2 flex-1 flex flex-col items-start justify-center">
            <p className={`text-base font-medium ${textColor}`}>{message}</p>
            {desc && <p className={`mt-1 text-sm ${textColor}`}>{desc}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;