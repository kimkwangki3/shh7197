import { useState, useCallback } from "react";

// 기존 카카오 로그인을 제거하고, 모든 사용자가 익명으로 참여할 수 있도록 훅을 간소화했습니다.
// (Admin 기능은 AdminLogin.tsx에서 별도의 토큰 방식으로 처리됩니다.)
export function useAuth() {
    const [user] = useState<any>(null);

    const login = useCallback(() => {
        // 더 이상 일반 사용자 로그인이 지원되지 않습니다.
        console.warn("로그인 기능이 비활성화되었습니다. 익명으로 참여 가능합니다.");
    }, []);

    const logout = useCallback(() => {
        // 기존 세션 정보 파기용
        localStorage.removeItem("user");
        window.location.reload();
    }, []);

    // 로그인 체크 없이 바로 콜백을 실행하도록 변경하여
    // 모든 사용자가 제약 없이 기능(투표 등)을 이용할 수 있도록 합니다.
    const checkAuthOrLogin = useCallback((callback: () => void) => {
        callback();
    }, []);

    return {
        user,
        login,
        logout,
        checkAuthOrLogin,
        isLoading: false
    };
}

