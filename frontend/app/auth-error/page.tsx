import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthErrorContent from "./AuthErrorContent";

export default function AuthErrorPage() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Suspense fallback={null}>
        <AuthErrorContent />
      </Suspense>
    </>
  );
}