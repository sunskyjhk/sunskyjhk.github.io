---
layout: post
title: "Go init 함수"
author: Sun
date: 2020-03-27 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "Go에서 응용 프로그램을 만들 때 프로그램을 처음 시작할 때 어떤 형태의 상태를 설정할 수 있어야하는 경우가 있습니다. 
여기에는 데이터베이스에 대한 연결을 만들거나 로컬로 저장된 구성 파일에서 구성을 로드하는 것이 포함될 수 있습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="theinitFunction">init 함수란?</a>
      </li>
      <li>
        <a href="multiplePackages">다중 패키지</a>
      </li>
      <li>
        <a href="#orderOfInitialization">초기화 순서</a>
      </li>
      <li>
        <a href="#multipleInitFunction">Structs로 파싱하기</a>
      </li>
      <li>
        <a href="#unmarshallingOurXML">XML 언마샬링</a>
      </li>
      <li>
        <a href="#fullImplementation">전체 구현</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>


Go 에서이 작업을 수행 할 때 init () 함수가 작동합니다. 
이 튜토리얼에서는이 init () 함수를 사용하여 명성과 
영광을 얻는 방법 또는 다음 Go 기반 프로젝트를 빌드하는데 도움이되는 방법을 살펴 보겠습니다.