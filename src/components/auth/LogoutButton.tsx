"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppStore } from "@/lib/store.zustand";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";

export default function LogOutButton() {
  const { logout } = useAppStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { status } = useSession();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setLoading(true);
       if (status == "authenticated") {
        await signOut({ redirect: false });
      }
      // Call the logout API to clear server-side cookies
      await axios.post('/api/auth/logout');

      // Clear client-side cookies as backup
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
      
      logout();
      // router.push('/')
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };
  return (
    <>
      <button
        onClick={handleLogoutClick}
        className="flex items-center gap-2 px-4 py-2 bg-starburst-orange/20 text-starburst-orange rounded-lg hover:bg-starburst-orange/30 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-midnight-gray p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-cool-white">
              Confirm Logout
            </h3>
            <p className="text-cool-white/70 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleLogoutCancel}
                className="px-4 py-2 bg-ai-blue/20 text-ai-blue rounded-lg hover:bg-ai-blue/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-starburst-orange/20 text-starburst-orange rounded-lg hover:bg-starburst-orange/30 transition-colors"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
