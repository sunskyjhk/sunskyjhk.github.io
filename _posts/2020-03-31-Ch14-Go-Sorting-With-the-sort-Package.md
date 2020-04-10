---
layout: post
title: "정렬 패키지를 사용하기"
author: Sun
date: 2020-03-31 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "순서대로 항목을 정렬하는 것은 모든 프로그래머가 의심할 여지없이 경력의 한 시점에서 해야 할 일입니다. 
선택할 수 있는 접근 방식과 정렬 알고리즘이 다양하지만 일반적으로 이미 구현된 패키지를 사용하여 정렬하는 것이 좋습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#goals">목표</a>
      </li>
      <li>
        <a href="#prerequisites">준비하기</a>
      </li>
      <li>
        <a href="#aSimpleSortingExample">간단한 정렬 예시</a>
      </li>
      <li>
        <a href="#customSortingFunctions">사용자 정의 정렬 함수</a>
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

순서대로 항목을 정렬하는 것은 모든 프로그래머가 의심할 여지없이 경력의 한 시점에서 해야할 일입니다. 
선택할 수 있는 접근 방식과 정렬 알고리즘이 다양하지만 일반적으로 이미 구현된 패키지를 사용하여 정렬하는 것이 좋습니다.

<h3 id="goals">
  <a href="#goals"></a>
  목표
</h3>

이 포스팅을 이해하면 다음을 수행하는 방법을 알게됩니다.

* "sort"패키지를 사용하여 Go 응용 프로그램 내에서 기본 sort 구현
* 복합 데이터 구조를 정렬할 수 있는 사용자 정의 sort 함수 구현

<h3 id="prerequisites">
  <a href="#prerequisites"></a>
  준비하기
</h3>

이 포스팅의 내용을 수행하려면 다음이 필요합니다.

* GoLang v1.11+ 이상
* 작업할 수 있는 텍스트 편집기

<h3 id="aSimpleSortingExample">
  <a href="#aSimpleSortingExamples"></a>
  간단한 정렬 예시
</h3>

다양한 배열을 정렬할 수 있는 정말 간단한 정렬 응용 프로그램을 살펴 보겠습니다.

새 프로젝트 디렉토리 내에 `main.go`라는 새 파일을 작성하십시오. 이 안에 `int` 요소의 배열을 정의할 것 입니다.

> **main.go**

```go 
package main

import "fmt"

func main() {
    fmt.Println("Go Sorting Tutorial")
    
    // our unsorted int array
    unsorted := []int{1,3,2,6,3,4}
	fmt.Println(unsorted)
}
```

그리고 이것을 실행하면 다음을 얻을 수 있습니다:

```bash
$ go run main.go

Go Sorting Tutorial
[1 3 2 6 3 4]
```

`sort` 패키지를 사용하여 이를 정렬하는 방법을 살펴 보겠습니다.

>**main.go**

```go 
package main

import (
	"fmt"
	"sort"
)

func main() {
	fmt.Println("Go Sorting Tutorial")
	
	myInts := []int{1,3,2,6,3,4}
	fmt.Println(myInts)
	
	// we can use the sort.Ints
	sort.Ints(myInts)
	fmt.Println(myInts)
}
```

<h3 id="customSortingFunctions">
  <a href="#customSortingFunctions"></a>
  사용자 정의 정렬 함수
</h3>

학습서의 이 섹션에서는 사용자 정의 정렬 함수를 사용하여 보다 복잡한 데이터 구조를 정렬하는 방법을 설명합니다.

사용자 정렬 함수를 구현하려면 먼저 정렬하려는 항목의 유형으로 배열을 정의해야합니다.

이 경우 solitary `Age` field를 특징으로하는 `Programmer` 유형의 `array`을 정렬합니다. 
따라서 이 예에서 연령별로 정렬할 때 `[]Programmer` 유형을 정의해야합니다. 
그런 다음 이 유형을 기반으로하는 세 가지 방법을 만들어야합니다.

* `Len()`-항목 배열의 길이를 반환
* `Swap()`-정렬된 배열에서 두 요소의 위치를 바꾸는 함수
* `Less()`-위치 `i`의 항목이 위치 `j`의 항목보다 작은지 여부에 따라 `bool` 값을 반환하는 함수입니다.

```go 
package main

import (
	"fmt"
	"sort"
)

type Programmer struct {
	Age int 
} 

type byAge []Programmer

func (p byAge) Len() int {
	return len(p)
}

func (p byAge) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
} 

func (p byAge) Less(i, j int) bool {
	return p[i].Age < p[j].Age
}

func main() {
    programmers := []Programmer{
		Programmer{Age: 30,},
		Programmer{Age: 20,},
		Programmer{Age: 50,},
		Programmer{Age: 1000,},
	}

	sort.Sort(byAge(programmers))

	fmt.Println(programmers)
}
```

이것을 실행하면 `programmers` 배열이 `programmer` 구조체의 각 `Age` 필드를 기준으로 정렬됩니다.

```bash
$ go run main.go
[{20} {30} {50} {1000}]
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

놀랍게도 이 포스트에서는 "sort" 패키지를 사용하여 Go 응용 프로그램에서 정렬을 구현할 수 있었습니다.

또한 애플리케이션에서보다 복잡한 데이터 구조를 정렬할 수 있는 자체 정렬 기능을 구현하는 방법도 살펴 보았습니다.

<h3 id="furtherReading">
  <a href="#furtherReading"></a>
  추가 자료
</h3>

이 포스팅이 이해가 되셨다면 다음과 같은 포스팅을 참고할 수도 있습니다.

* [Go 루틴과 함께하는 동시성 (TBA)]
