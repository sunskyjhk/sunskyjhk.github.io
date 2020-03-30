---
layout: post
title: "Go 프로젝트 구조 모범 사례"
author: Sun
date: 2020-03-28 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "Go 애플리케이션이 따라야하는 구조는 다소 논쟁적인 주제입니다. 
어떤 사람들은 모든 사람이 절대적으로 모든 프로젝트에 대해 잘 알려진 
`golang-standards/project-layout` 
구조를 따라야한다는 것을 강경합니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="smallApplications">Small Applications - Flat Structure</a>
      </li>
      <li>
        <a href="benefits">혜택</a>
      </li>
      <li>
        <a href="#examplesofThisStructure">이 구조의 예제</a>
      </li>
      <li>
        <a href="#mediumLargeSizedApplications">Medium/Large 애플리케이션-모듈화</a>
      </li>
      <li>
        <a href="#examplesofThisStructure2">이 구조의 예제</a>
      </li>
      <li>
        <a href="#matureProjects">Mature 프로젝트</a>
      </li>
      <li>
        <a href="#splittingUpProjects">프로젝트 분할하기</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
      <li>
        <a href="#furtherReading">추가 자료</a>
      </li>
    </ul>
  </nav>
</div>

Go 애플리케이션이 따라야하는 구조는 다소 논쟁적인 주제입니다. 
어떤 사람들은 모든 사람이 절대적으로 모든 프로젝트에 대해 잘 알려진 
[golang-standards/project-layout](https://github.com/golang-standards/project-layout) 
구조를 따라야한다는 것을 강하게 주장합니다.

그러나 종속성을 처리하기위한 표준으로 Go 모듈이 도입되면서 이 구조는 문제를 제기하기 시작합니다. 
기존 구조와 마찬가지로 구조 내의 일부 폴더는 `internal` 또는 `pkg`와 같은 폴더에 액세스 할 수 없으며 
그대로 유지하려면 다소 해킹된 솔루션을 구현해야 합니다.

이 포스트에서는 Go 응용 프로그램을 새로운 세계 질서로 구성할 때 선택할 수 있는 다양한 옵션을 제시합니다.

>**참고** – 응용 프로그램을 구성할 때는 "한 번에 한 번"접근하는 방법이 없습니다. 
>응용 프로그램이 발전함에 따라 프로젝트 구조화 방법도 마찬가지입니다.

<h3 id="smallApplications">
  <a href="#smallApplications"></a>
  Small Applications - Flat Structure
</h3>

모든 프로젝트는 소규모로 시작하여 얼마나 성공적인지 또는 개발자가 얼마나 많은 시간을 기꺼이 참여 하느냐에 따라 
몸집이 점차 커집니다.

```bash
application/
 - main.go
 - main_test.go
 - utils.go
 - utils_test.go
 - ...

```

이러한 상황에서는 위에서 설명한 것과 같은 플랫 폴더 구조로 시작하는 것이 좋습니다. 
개발자는 프로젝트 구조를 단순하게 유지함으로써 복잡한 구조의 인지적인 오버 헤드없이 가능한한 빨리 
원하는 대상에게 최대한의 가치를 제공하는데 집중할 수 있습니다.

나는 종종 개발자들이 실제 가치가있는 어떤 것이 전달되기 전에 프로젝트 초기 단계에서 
코드베이스를 정리하고 재정렬하는데 더 많은 시간을 소비하는 것을 보았고 궁극적으로 
개발자 또는 개발자 팀과 개발자 사이의 피드백 루프 코스트가 커지게됩니다.

<h3 id="benefits">
  <a href="#benefits"></a>
  혜택
</h3>

이 플랫 폴더 구조는 다음과 같은 개발에 이상적입니다.

* **마이크로 서비스**-분산된 방식으로 배포된 작은 응용 프로그램으로 한 가지 작업만 수행할 수 있습니다.
* **작은 도구 및 라이브러리**-몇 가지 작업을 실제로 수행하는데 중점을 둔 명령줄 도구 또는 작은 라이브러리입니다.

<h3 id="examplesofThisStructure">
  <a href="#examplesofThisStructure"></a>
  이 구조의 예제
</h3>

이 구조가 작동하는 위치의 몇 가지 예를 살펴 보겠습니다.

* [tidwall/gjson](https://github.com/tidwall/gjson)-이 프로젝트는 매우 미니멀한 구조로 프로젝트가 
어떻게 성공할 수 있는지에 대한 요점을 거의 완벽하게 보여줍니다. 
그들은 프로젝트를 사용하는 사람들에게 실질적인 가치를 제공하는데 
초점을 두면서 처음부터 모든 것을 놀라울 정도로 평평하고 너무 복잡하지 않게 유지했습니다.

* [go-yaml/yaml](https://github.com/go-yaml/yaml)-완전히 평평한 프로젝트 구조를 특징으로하는 
또 다른 멋진 프로젝트

<h3 id="mediumLargeSizedApplications">
  <a href="#mediumLargeSizedApplications"></a>
  Medium/Large 애플리케이션-모듈화
</h3>

프로젝트의 규모와 복잡성이 커짐에 따라 코드베이스 모듈화를 
고려해야 할 때가 되는 평평한 구조보다 빠르게 성장하기 시작합니다.

웹 사이트를 강화하는 REST API를 예로 들어 보겠습니다. 
이 REST API에는 사용자 등록 및 로그인을 처리하는 엔드 포인트와 
CRUD와 같은 방식으로 사용자의 컨텐츠를 처리하는 다른 그룹이 있을 수 있습니다.

이제 애플리케이션을 시맨틱 기능 그룹으로 분리하고 이러한 컴포넌트에서 공유되는 모든 핵심 로직을 
프로젝트 내의 공유 패키지로 중앙 집중화하는 것을 고려해야합니다.

```bash
rest-api/
- main.go
- user/
- - user.go
- - login.go
- - registration.go
- articles/
- - articles.go
- utils/
- - common_utils.go
```

<h3 id="examplesofThisStructure2">
  <a href="#examplesofThisStructure2"></a>
  이 구조의 예제
</h3>

이 구조를 채택한 Go 프로젝트는 다음과 같습니다.

* [google/go-cloud](https://github.com/google/go-cloud) - 이 구조를 채택한 프로젝트의 훌륭한 예입니다. 
이들은 각 IAAS Cloud Providers에 대한 프로젝트를 패키지로 분할했으며 각 패키지에는 
해당 특정 Cloud 제공자와 관련된 모든 코드가 포함되어 있습니다.
* [hashicorp/consul](https://github.com/hashicorp/consul) – 이것은 모듈식 접근 방식을 채택하기로 
선택한 대규모 프로젝트의 또 다른 훌륭한 예입니다.
* [ipfs/go-ipfs](https://github.com/ipfs/go-ipfs) - IPFS는 Git 및 BitTorrent와 같은 이전 시스템을 
기반으로 Go로 작성된 매우 멋진 P2P 파일 시스템입니다. 다시 한 번, 그들은 시스템을 개발할 때 모듈식 접근 방식을 선택했습니다.
* [gohugoio/hugo](https://github.com/gohugoio/hugo) - 현재 이 사이트의 백엔드로 사용되는 매우 멋진 프레임 워크입니다!

<h3 id="matureProjects">
  <a href="#matureProjects"></a>
  Mature 프로젝트
</h3>

이전 프로젝트 구조를 준수하는 프로젝트는 계속볼 수 있지만 
이는 이러한 응용 프로그램이 개발된 시간의 부산물입니다.

Hashicorp의 Terraform 또는 Google 자체 Kubernetes와 같은 대규모 응용 프로그램은 `$GOPATH`가 
최고를 다스렸을 때 아주 잘 작동하던 이전 스타일의 구조의 잔재를 특징으로하는 경향이 있습니다. 
여기에는 여전히 프로젝트의 내부 작업 중 일부를 캡슐화하는 `internal` 및 `pkg` 폴더가 있습니다.

* [hashicorp/terraform](https://github.com/hashicorp/terraform/tree/master/terraform)
* [Kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)

이 구조는 예외적으로 잘 작동하여 개발자가 개발 커뮤니티에 놀라운 가치를 전달할 수 있게 해주었지만 
Go Modules가 널리 보급됨에 따라 이러한 응용 프로그램이 보다 전통적인 구조에서 벗어나 새로운 구조로 이전하게 되는 것을 볼 수 있을 것입니다.

<h3 id="splittingUpProjects">
  <a href="#splittingUpProjects"></a>
  프로젝트 분할하기
</h3>

특정 시점이 지나면 프로젝트의 특정 부분을 자체 수명주기가 있는 
별도의 리포지토리로 완전히 추출하는 것이 좋습니다.

프로젝트 영역 전체의 업데이트 관리와 관련하여 오버헤드 증가와 같은 고유한 단점이 있습니다. 
그러나 이는 또한 프로젝트 참여 및 도움을 원하는 신규 이민자를 위해 프로젝트를 더 쉽게 소화할 수 있음을 의미합니다.

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이 포스트가 개발 노력에 도움이 되었고 다음 Go 프로젝트 모델링을 시작할 때 몇 가지 아이디어를 제공했으면 합니다.

이것들은 일상 업무에서 서비스 및 서비스 중개인을 개발하는 개인적인 개발 경험에 근거한 저의 발견입니다. 
이러한 구조를 사용할 때 자신의 마일리지가 다를 수 있지만 아래 의견 섹션에서 Go 응용 프로그램을 구성하는 방법에 대한 
자신의 생각과 팁을 듣고 싶습니다!

<h3 id="furtherReading">
  <a href="#furtherReading"></a>
  추가 자료
</h3>

이 포스팅과 연계하여 다음 포스팅도 살펴봐 주세요.

* Go 모듈 튜토리얼 (TBA)
