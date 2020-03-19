---
layout: post
title: "Go 메서드 (Go Methods)"
author: Sun
date: 2020-03-18 05:00:01 -0900
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
---
<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#aSimpleExample">간단한 예제</a>
      </li>
      <li>
        <a href="#functionsVsMethods">함수 VS 메서드</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

이 포스팅에서는 우선 메서드가 무엇인지와 Go 프로그래밍 언어의 범위 내에서 그것이
어떻게 작동하는지 살펴 보겠습니다. 그런 다음 메서드과 함수의 차이점과 Go 프로그램 내에서 
이상적으로 사용해야하는 시점을 설명합니다.

<h3 id="aSimpleExample">
  <a href="#aSimpleExample"></a>
  간단한 예제
</h3>

Go 시스템에서 스스로 어떤 메서드를 어떻게 구현할 수 있는지를 다루면서 시작하겠습니다. 
직원 이름을 업데이트하고 그 이름을 인쇄할 수 있는 매우 간단한 직원 관리 시스템을 만들 것입니다. 
아주 흥미로운 예제 프로젝트는 아니지만 데모의 목적으로 사용됩니다.

먼저 이름이 하나인 문자열 필드를 특징으로하는 Employee 타입의 구조체를 만듭니다.

다음으로 우리가 만든 직원의 이름을 업데이트하고 인쇄할 수 있는 `UpdateName()` 및 
`PrintName()` 메서드를 선언합니다.

<h3 id="functionsVsMethods">
  <a href="#functionsVsMethods"></a>
  함수 VS 메소드
</h3>
<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>
