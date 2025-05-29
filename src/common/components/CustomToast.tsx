// utils/showToast.tsx
import { toast } from "react-hot-toast";
import Toast from "./Toast";

interface ToastOptions {
  type: "success" | "error" | "info"; // Added 'info' type
  showIcon?: boolean;
  message: string;
  desc?: string;
}

const easyToast = ({ type, message, desc, showIcon = true }: ToastOptions) => {
    console.log("TOAST TRIGGERED:", message); // <- Debug log
  toast.custom((t) => (
    <Toast
      type={type}
      message={message}
      toastId={t.id}
      desc={desc}
      showIcon={showIcon}
    />
  ));
};

export default easyToast;