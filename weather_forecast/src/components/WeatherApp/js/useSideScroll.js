import { useRef, useEffect } from "react";

export function useHorizontalScroll() {
    const elRef = useRef();
    useEffect(() => {
        const el = elRef.current; //custom hooks로 DOM 엘리먼트의 ref를 가져와서 이벤트 리스너를 연결하고, horizontal scroll 컴포넌트를 구현하였다.
        if (el) {
            const onWheel = e => {
                if (e.deltaY == 0) return;
                e.preventDefault();
                el.scrollTo({ // scrollTo를 이용하여 특정 위치로 이동 시키기
                    left: el.scrollLeft + e.deltaY, // 휠 이벤트 작동시 x축으로 이동 + deltaY는 Y축 스크롤량을 반환하는데 그 반환한 만큼 x축으로 이동하도록 하여 좌우 휠 스크롤 작동
                    behavior: "smooth" // 부드럽게 움직이는 효과
                });
            };
            el.addEventListener("wheel", onWheel); // 걸려있는 이벤트 핸들러 추가
            return () => el.removeEventListener("wheel", onWheel); // 마우스 wheel이벤트에 대한 event listener를 추가하고 필요에따라 제거해서 성능 이슈를 방지한다.
        }
    }, []);
    return elRef;
}