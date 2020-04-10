---
layout: post
title: "Go에서 Linked Lists 다루기"
author: Sun
date: 2020-04-04 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Go에서 Linked Lists를 작성하고 
작업할 수 있는 방법을 살펴 보겠습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#thecontainer">container/list 패키지</a>
      </li>
      <li>
        <a href="#defining">Linked Lists 구조 정의하기</a>
      </li>
      <li>
        <a href="#iteratingGo">Go에서의 Linked Lists를 이용한 반복</a>
      </li>
      <li>
        <a href="#populatingList">Linked List 채우기</a>
      </li>
      <li>
        <a href="#removing">Linked List에서 요소 제거</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
      <li>
        <a href="#furtherReading">더 읽을거리</a>
      </li>
    </ul>
  </nav>
</div>

이 포스트에서는 Go에서 링크된 목록을 작성하고 
작업할 수 있는 방법을 살펴 보겠습니다.

연결된 목록은 computer science에서 
매우 다양한 데이터 작업으로 다양한 작업에 사용할 수 있습니다. 
그들은 또한 프로그래밍 인터뷰 질문에 많이 사용되므로, 
새로운 직업에 잘 적응하려면 그들이 어떻게 작동하고 
Go에서 하나를 만들 수 있는지에 대해 아는 지식이 중요합니다!

<h3 id="thecontainer">
  <a href="#thecontainer"></a>
  container/list 패키지
</h3>

고맙게도 Go에는 편리한 linked list 구조가 이미 구현되어 있으며 
container/list 패키지를 (`container/list`)의 형태로 사용할 수 있습니다.

이 굉장히 편리한 패키지에는 list 구조에 노출된 여러 가지 
다른 유용한 방법이 포함되어 있으므로 linked list를 쉽게 쿼리하고 
최소한의 번거로움 없이 반복할 수 있습니다.

이 포스트에서는 고유한 linked list를 정의하고 이러한 linked list로 
작업할 때 보다 편리하게 사용할 수 있는 몇 가지 방법을 설명합니다.

<h3 id="defining">
  <a href="#defining"></a>
  Linked Lists 구조 정의하기
</h3>

먼저 Go에서 linked list를 정의하는 방법을 살펴보겠습니다.

>**main.go**

```go
package main

import (
    "fmt"
    "container/list"
)

func main() {
    fmt.Println("Go Linked Lists Tutorial")
    mylist := list.New()
    mylist.PushBack(1)
    mylist.PushFront(2)
    // we now have a linked list with '1' at the back of the list
    // and '2' at the front of the list.
}
```

이 예제에서는 정수의 linked list를 만들지만 
Value 유형을 다른 구조체 유형과 같이 원하는 것으로 변경할 수 있습니다. 

<h3 id="iteratingGo">
  <a href="#iteratingGo"></a>
  Go에서의 Linked Lists를 이용한 반복
</h3>

Go에서 이와 같은 linked list를 반복할 수 있는 몇 가지 방법이 있습니다. 
가장 간단한 방법은 linked list에서 첫 번째 노드를 처리한 다음 
for 루프를 사용하여 나머지 linked list를 반복하여 다음 노드가 
없는지 확인합니다.

>**main.go**

```go 
package main

import (
    "fmt"
    "container/list"
)

func main() {
    fmt.Println("Go Linked Lists Tutorial")
    
    mylist := list.New()
    mylist.PushBack(1)
    mylist.PushFront(2)

    for element := mylist.Front(); element != nil; element = element.Next() {
    // do something with element.Value
    fmt.Println(element.Value)
    }

}
```

이를 실행하면 linked list의 각 노드 내에 정의된 모든 값이 인쇄됩니다.

>**$go run main.go**

```bash
Go Linked Lists Tutorial
2
1
```

<h3 id="populatingList">
  <a href="#populatingList"></a>
  Linked List 채우기
</h3>

linked list를 채우는데는 여러 가지 방법이 있습니다. 
이전 코드 스니펫에서 이미 PushBack 및 PushFront 메소드를 보았습니다. 
이들은 list의 앞이나 뒤에서 linked list에 새로운 요소를 삽입하는 역할을 합니다.

>**main.go**

```go 
mylist.PushBack(1)

mylist.PushFront(1)

mylist.InsertAfter
```

<h3 id="removing">
  <a href="#removing"></a>
  Linked List에서 요소 제거
</h3>

linked list에서 요소를 삭제하는데 있어 또 다른 방법이 있습니다. 
이 메소드는 적절한 이름의 Remove() 메소드입니다!

>**main.go**

```go 
element := mylist.Front()
mylist.Remove(element)
```

Remove 함수는 목록 내 요소에 대한 포인터를 가져 와서 
linked list 내에서 특정 임계 값을 충족하지 않는 요소를 
필터링하려는 편리한 상황에서 사용할 수 있습니다.

>**main.go**

```go 
package main

import (
    "fmt"
    "container/list"
)


func main() {

    mylist := list.New()
    mylist.PushBack(1)
    mylist.PushFront(2)
    
    for element := mylist.Front(); element != nil; element = element.Next() {
        // do something with element.Value
        if element.Value != 1 {
            mylist.Remove(element)
        }
    }
    
    for element := mylist.Front(); element != nil; element = element.Next() {
        // do something with element.Value
        fmt.Println(element.Value)
    }

}
```

이것을 실행하면 두 번째 for 루프는 1만 출력하고 
특정 기준을 충족하는 요소에 대해 linked list를 성공적으로 필터링했습니다!

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

굉장합니다.
이 포스트에서는 Go에서 linked list로 작업하는 방법을 살펴 보았습니다. 
우리는 linked list를 정의하고 linked list와 
상호작용 할 수 있는 다양한 방법을 다루었습니다.

<h3 id="furtherReading">
  <a href="#furtherReading"></a>
  더 읽을거리
</h3>

이 튜토리얼을 즐기거나 
유용하다고 생각되면 다음과 같은 다른 포스트를 활용할 수도 있습니다.

* [Go Maps Tutorial TBA]()