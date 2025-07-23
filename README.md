# My Subway (서울시 지하철 실시간 위치 확인)

[서울시 지하철 실시간 도착정보](https://data.seoul.go.kr/dataList/OA-12764/F/1/datasetView.do#)

지하철역 이름을 사용해서 현재 지하철의 실시간 위치를 확인할 수 있는 PWA 기반 웹앱입니다.

---

## 개요

서울시 지하철 실시간 도착정보 공공 API를 사용해서 내가 원하는 역의 지하철 도착 정보를 확인할 수 있도록 한다.

---

## 주요 기능

- 역 이름으로 실시간 지하철 위치 검색
- 상행/하행, 환승 노선 구분 및 탭 UI
- 최근 검색어 및 즐겨찾기(로컬스토리지)
- 푸시 알림(PWA, Web Push)
- iOS/Android PWA 설치 가이드
- 회원가입/로그인/로그아웃(인증)
- Storybook 기반 UI 컴포넌트 문서화

---

## 폴더 구조 및 역할

- `src/components/` : 주요 UI 컴포넌트, 인증 폼, 지하철 정보, 검색바 등
  - `auth/` : 로그인/회원가입/로그아웃 폼
  - `ui/` : 버튼, 입력창, 다이얼로그 등 공통 UI
  - `services/` : LocalStorage 등 서비스성 유틸
- `src/pages/` : Home, Signin, Signup 등 라우트별 페이지
- `src/layout/` : 공통 레이아웃, 인증 보호 라우트
- `src/hooks/` : 커스텀 훅(PWA, 알림, 웹소켓, 검색 등)
- `src/stores/` : Zustand 기반 전역 상태관리(유저, 검색, 구독 등)
- `src/provider/` : WebSocketProvider 등 Context
- `src/lib/` : 인증 체크, 유틸 함수
- `src/assets/` : 이미지, 아이콘 등 정적 리소스
- `src/utils/` : 테스트 유틸 등
- `src/stories/` : Storybook 스토리

---

## 기술 스택

- **Frontend**: React 18, Vite, TypeScript, Zustand, TailwindCSS, Shadcn/ui, React Hook Form, Zod
- **PWA**: VitePWA, Service Worker, Web Push
- **테스트**: Jest, Testing Library, MSW(Mock Service Worker)
- **문서화**: Storybook
- **기타**: React Router, Lucide-react(아이콘), Radix UI

---

## 실행 및 개발 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과물 프리뷰
npm run preview

# 린트 검사
npm run lint

# 테스트(Jest)
npm run test

# Storybook 실행
npm run storybook

# Storybook 빌드
npm run build-storybook
```

---

## 환경 변수

- `.env` 파일에 다음과 같은 변수를 설정해야 합니다.
  - `VITE_WS_ENDPOINT` : 실시간 WebSocket 서버 주소
  - (필요시) API 서버 주소 등

---

## PWA 및 알림

- PWA 설치는 Android/Chrome, iOS(Safari) 모두 지원
- 푸시 알림(Web Push) 지원, 서비스워커 자동 등록
- iOS는 별도 설치 가이드 제공




