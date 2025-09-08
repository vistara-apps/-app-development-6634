import { useCallback, useEffect, useState } from 'react';

export function useBaseMiniApp() {
  const [isFrameContext, setIsFrameContext] = useState(false);
  const [frameData, setFrameData] = useState(null);

  useEffect(() => {
    // Check if running in Base MiniApp Frame context
    const checkFrameContext = () => {
      const isFrame = window.parent !== window || 
                     window.location !== window.parent.location ||
                     document.referrer.includes('base.org') ||
                     window.frameElement !== null;
      setIsFrameContext(isFrame);
    };

    checkFrameContext();
    
    // Listen for frame messages
    const handleMessage = (event) => {
      if (event.origin.includes('base.org') || event.origin.includes('coinbase.com')) {
        setFrameData(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendFrameAction = useCallback((action, data = {}) => {
    if (isFrameContext && window.parent) {
      window.parent.postMessage({
        type: 'FRAME_ACTION',
        action,
        data,
        timestamp: Date.now()
      }, '*');
    }
  }, [isFrameContext]);

  const setPrimaryButton = useCallback((config) => {
    sendFrameAction('SET_PRIMARY_BUTTON', config);
  }, [sendFrameAction]);

  const showNotification = useCallback((message, type = 'info') => {
    sendFrameAction('SHOW_NOTIFICATION', { message, type });
  }, [sendFrameAction]);

  const saveFrame = useCallback((state) => {
    sendFrameAction('SAVE_FRAME', { state });
  }, [sendFrameAction]);

  const triggerInFrameAction = useCallback((actionType, payload = {}) => {
    sendFrameAction('IN_FRAME_ACTION', { actionType, payload });
  }, [sendFrameAction]);

  return {
    isFrameContext,
    frameData,
    setPrimaryButton,
    showNotification,
    saveFrame,
    triggerInFrameAction,
    sendFrameAction
  };
}
