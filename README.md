[서울시 지하철 실시간 도착정보](https://data.seoul.go.kr/dataList/OA-12764/F/1/datasetView.do#)

지하철역 이름을 사용해서 현재 지하철의 실시간 위치를 확인할 수 있다.

## 개요

서울시 지하철 실시간 도착정보 공공 API를 사용해서 내가 원하는 역의 지하철 도착 정보를 확인할 수 있도록 한다.

## 기술 스택

- Vite - React
  - CRA를 사용해서 리액트 앱을 만드는 것이 아니라 Vite를 사용한다. Vite 사용 방법에 대해서 자세히 학습한다.
  - Next.js가 아닌 React를 사용해서 개발한다. 실시간으로 정보를 받아와야 하는 앱으로써 RSC, SSR을 사용하는 빈도가 낮을 것으로 예상되고 Next.js에서 제공해주는 코드 분할, App Routes와 같은 편의기능에 의존하는 경향이 높아졌기 때문에 순수한 React로 프로젝트를 구현해 본다.
- Shadcn/ui
  - 많이 사용된다고 하는데 그 이유를 좀 알아보자

## 구현 목표

- 초기
  - [ ] API로 내가 원하는 역의 지하철 정보를 얻어와서 보여준다
    - [ ] input은 우선 직접 입력으로 구현한다.
  - [ ] 상행선/하행선을 구분하여 상하로 보여준다. (환승 노선의 경우 탭으로 분리한다.)
  - [ ] 사용자가 즐겨찾기한 역은 localstorage에 저장한다.
- 중기
  - [ ] input에 필터를 적용해서 호선별로 검색할 수 있도록 도와준다.
  - [ ] 자동완성 기능을 통해 사용자가 빠르게 입력할 수 있도록 도와준다.
  - [ ] Proxy를 사용해서 (또는 다른 방법으로) API Key가 노출되지 않도록 한다.
  - [ ] 필요에 따라 RSC, SSR을 도입해본다. (미정)
- plus
  - [ ] PWA를 적용해본다. (방법을 모름)
  - [ ] 웹 브라우저에서 GPS를 사용해본다. (근처 역 찾기)
