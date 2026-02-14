import { useState, useMemo, useEffect } from 'react';
import { PiNetworkClient } from '@xhilo/pi-sdk';

// Type definitions for Pi Network SDK alignment
interface PiUser {
  username: string;
  uid: string;
}

export const usePiNetwork = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<PiUser | null>(null);

  // Initialize Pi SDK instance
  const pi = useMemo(() => {
    try {
      // MANDATORY: Manually trigger the global Pi init for the Sandbox/Portal handshake
      if (typeof window !== 'undefined' && (window as any).Pi) {
        (window as any).Pi.init({ version: "2.0", sandbox: true });
        console.log("Pi SDK Global Init: Success (Sandbox Mode)");
      }

      // Return the client wrapper
      return new PiNetworkClient(true);
    } catch (error) {
      console.error("Pi SDK Init Error:", error);
      return null;
    }
  }, []);

  // Initialize and check authentication on mount
  useEffect(() => {
    if (!pi) return;

    pi.initialize().then((result: any) => {
      // Check if result exists and is successful
      if (result && result.success) {
        const currentUser = pi.getUser();
        if (currentUser) {
          setIsAuthenticated(true);
          setUser({
            uid: currentUser.uid,
            username: currentUser.username || ''
          });
        }
      }
    }).catch((err: any) => {
      console.warn('Pi Initialization silent catch:', err);
    });
  }, [pi]);

  const authenticate = async () => {
    if (!pi) return;

    try {
      // Simplified authentication: Only ask for 'username'
      // We keep the empty callback () => {} because the SDK requires it
      const result = await pi.authenticate(['username'], (_payment: any) => {
        console.log('Sandbox safety check: No payment logic active.');
      });

      if (result && result.success && result.data) {
        setIsAuthenticated(true);
        setUser({
          uid: result.data.uid,
          username: result.data.username || ''
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return {
    pi,
    isAuthenticated,
    user,
    authenticate,
  };
};