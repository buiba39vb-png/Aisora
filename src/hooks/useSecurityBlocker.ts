import { useState, useEffect, useCallback, useRef } from 'react';

interface SecurityState {
  isDevToolsBlocked: boolean;
  blockedReason: string;
  securityToast: string | null;
  clearSecurityToast: () => void;
  verifyDevToolsClosed: () => boolean;
}

export function useSecurityBlocker(enabled: boolean = true): SecurityState {
  const [isDevToolsBlocked, setIsDevToolsBlocked] = useState<boolean>(false);
  const [blockedReason, setBlockedReason] = useState<string>('');
  const [securityToast, setSecurityToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  const showSecurityNotice = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setSecurityToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setSecurityToast(null);
    }, 3000);
  }, []);

  const clearSecurityToast = useCallback(() => {
    setSecurityToast(null);
  }, []);

  // Kiểm tra DevTools có đang mở hay không
  const checkDevTools = useCallback((): boolean => {
    if (!enabled) return false;

    let isIframe = false;
    try {
      isIframe = window.self !== window.top;
    } catch {
      isIframe = true;
    }

    // 1. Kiểm tra kích thước cửa sổ (chỉ áp dụng khi không nằm trong iframe để tránh false positive trong preview)
    let isDimensionDocked = false;
    if (!isIframe) {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      isDimensionDocked = widthDiff > threshold || heightDiff > threshold;
    }

    // 2. Debugger execution timing check
    let timingDetected = false;
    try {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        timingDetected = true;
      }
    } catch {
      // ignore
    }

    if (isDimensionDocked || timingDetected) {
      setIsDevToolsBlocked(true);
      setBlockedReason(
        isDimensionDocked 
          ? 'Phát hiện cửa sổ Developer Tools đang mở bên cạnh hoặc dưới cùng màn hình.' 
          : 'Phát hiện Debugger/Console đang can thiệp vào trang web.'
      );
      return true;
    }

    return false;
  }, [enabled]);

  // Hàm cho nút "Kiểm tra lại"
  const verifyDevToolsClosed = useCallback((): boolean => {
    let isIframe = false;
    try {
      isIframe = window.self !== window.top;
    } catch {
      isIframe = true;
    }

    if (!isIframe) {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      if (widthDiff > threshold || heightDiff > threshold) {
        setIsDevToolsBlocked(true);
        setBlockedReason('Developer Tools vẫn chưa được đóng hoàn toàn. Vui lòng đóng F12/Inspect.');
        return false;
      }
    }

    setIsDevToolsBlocked(false);
    setBlockedReason('');
    showSecurityNotice('Đã xác thực thành công. Chào mừng trở lại Shop Lê Dương!');
    return true;
  }, [showSecurityNotice]);

  useEffect(() => {
    if (!enabled) return;

    // 1. CHẶN TẤT CẢ PHÍM TẮT NGUY HIỂM: Ctrl+U, F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+S, Ctrl+P, Ctrl+Shift+K
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      // F12
      if (e.key === 'F12' || code === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('Phím F12 (Developer Tools) đã bị vô hiệu hóa vì lý do bảo mật!');
        setIsDevToolsBlocked(true);
        setBlockedReason('Phát hiện phím F12 (Mở Developer Tools)');
        return false;
      }

      // Ctrl + U (Xem mã nguồn)
      if (isCtrlOrMeta && key === 'u') {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('Thao tác Ctrl+U (Xem nguồn trang) đã bị vô hiệu hóa!');
        return false;
      }

      // Ctrl + Shift + I (Inspect)
      if (isCtrlOrMeta && e.shiftKey && (key === 'i' || code === 'KeyI')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('Tổ hợp Ctrl+Shift+I (Kiểm tra phần tử) đã bị chặn!');
        setIsDevToolsBlocked(true);
        setBlockedReason('Phát hiện thao tác mở Inspect Tool');
        return false;
      }

      // Ctrl + Shift + J (Console)
      if (isCtrlOrMeta && e.shiftKey && (key === 'j' || code === 'KeyJ')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('Tổ hợp Ctrl+Shift+J (Mở Console) đã bị chặn!');
        setIsDevToolsBlocked(true);
        setBlockedReason('Phát hiện thao tác mở Console');
        return false;
      }

      // Ctrl + Shift + C (Element Inspector)
      if (isCtrlOrMeta && e.shiftKey && (key === 'c' || code === 'KeyC')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('Tổ hợp Ctrl+Shift+C đã bị chặn vì lý do bảo mật!');
        setIsDevToolsBlocked(true);
        return false;
      }

      // Ctrl + Shift + K (Firefox Console)
      if (isCtrlOrMeta && e.shiftKey && (key === 'k' || code === 'KeyK')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('Tổ hợp Developer Tools đã bị chặn!');
        return false;
      }

      // Ctrl + S (Lưu trang web về máy)
      if (isCtrlOrMeta && key === 's') {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('Thao tác Ctrl+S (Lưu trang) đã bị vô hiệu hóa!');
        return false;
      }

      // Ctrl + P (In trang web)
      if (isCtrlOrMeta && key === 'p') {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('Thao tác in trang web bị chặn!');
        return false;
      }
    };

    // 2. CHẶN CHUỘT PHẢI (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      // Cho phép chuột phải trong thẻ input/textarea để paste mã pin nếu cần
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      e.preventDefault();
      showSecurityNotice('Chuột phải đã bị khóa để bảo vệ mã nguồn & tài khoản!');
    };

    // 3. Chu kỳ kiểm tra định kỳ DevTools
    const intervalId = setInterval(() => {
      checkDevTools();
    }, 2000);

    // 4. Lắng nghe thay đổi kích thước cửa sổ
    const handleResize = () => {
      let isIframe = false;
      try {
        isIframe = window.self !== window.top;
      } catch {
        isIframe = true;
      }

      if (!isIframe) {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if (widthDiff > threshold || heightDiff > threshold) {
          setIsDevToolsBlocked(true);
          setBlockedReason('Phát hiện kích thước cửa sổ thay đổi bất thường do mở Developer Tools.');
        } else if (widthDiff <= threshold && heightDiff <= threshold) {
          setIsDevToolsBlocked(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
    };
  }, [enabled, checkDevTools, showSecurityNotice]);

  return {
    isDevToolsBlocked,
    blockedReason,
    securityToast,
    clearSecurityToast,
    verifyDevToolsClosed,
  };
}
