---
layout: post
title: "Go Tickers 사용하기"
author: Sun
date: 2020-04-01 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Go의 티커와 고유한 Go 응용 프로그램 내에서 
티커를 효과적으로 사용할 수 있는 방법을 살펴 보겠습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#tickersvsTimers">Tickers vs Timers</a>
      </li>
      <li>
        <a href="#aSimpleExample">간단한 예시</a>
      </li>
      <li>
        <a href="#runningintheBackground">간단한 정렬 예시</a>
      </li>
      <li>
        <a href="#customSortingFunctions">백그라운드에서 실행</a>
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

이 포스트에서는 Go의 티커와 고유한 Go 응용 프로그램 내에서 
티커를 효과적으로 사용할 수 있는 방법을 살펴 보겠습니다.

티커는 주어진 시간 간격으로 반복적으로 작업을 수행해야 할 때 매우 유용하며, 
애플리케이션의 백그라운드에서 이러한 작업을 실행하기 위해 Go routine과 함께 티커를 사용할 수 있습니다.

<h3 id="tickersvsTimers">
  <a href="#tickersvsTimers"></a>
  Tickers vs Timers
</h3>

다이빙을하기 전에 `tickers`와 `timers`의 차이점을 아는 것이 좋습니다.

* **Tickers** - 반복 작업에 탁월합니다.
* **Timers** - 일회성 작업에 사용됩니다.

<h3 id="aSimpleExample">
  <a href="#aSimpleExample"></a>
  간단한 예시
</h3>

5 초마다 간단한 `fmt.Println` 문을 반복적으로 실행하는 매우 간단한 것으로 시작하겠습니다.

>**main.go**

```go 
package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("Go Tickers Tutorial")
	// this creates a new ticker which will
    // `tick` every 1 second.
    ticker := time.NewTicker(1 * time.Second)
	
    // for every `tick` that our `ticker`
    // emits, we print `tock`
	for _ = range ticker.C {
		fmt.Println("tock")
	}
}
```

이제이 프로그램을 실행하면 프로그램이 `ctrl-c`로 종료될 때까지 Go 응용 프로그램이 
무한정 실행되며 1 초마다 터미널에 `tock`가 출력됩니다.

> **go run main.go**

```bash
Go Tickers Tutorial
Tock
Tock
^Csignal: interrupt
```

<h3 id="customSortingFunctions">
  <a href="#customSortingFunctions"></a>
  백그라운드에서 실행
</h3>

따라서 `ticker`를 사용하여 반복적으로 작업을 수행하는 정말 간단한 Go 응용 프로그램을 구현할 수 있었습니다. 
그러나 Go 응용 프로그램의 background에서 이 작업을 수행하려면 어떻게 해야할까요?

우리가 백그라운드에서 실행하고 싶은 작업이 있다면, 
`ticker.C`를 반복하는 `for` 루프를 응용 프로그램이 
다른 작업을 실행할 수 있도록 `goroutine` 내부로 옮길 수 있습니다.

티커를 생성하고 `backgroundTask()`라는 새로운 함수로 루핑하는 코드를 이동한 다음 
`main()` 함수 내에서 `go` 키워드를 사용하여 이를 `goroutine`이라고합니다.

>**main.go**

```go
package main

import (
	"fmt"
	"time"
)

func backgroundTask() {
	ticker := time.NewTicker(1 * time.Second)
	for _ = range ticker.C {
		fmt.Println("Tock")
	}
}

func main() {
	fmt.Println("Go Tickers Tutorial")

	go backgroundTask()
	
    // This print statement will be executed before
    // the first `tock` prints in the console
	fmt.Println("The rest of my application can continue")
	// here we use an empty select{} in order to keep
    // our main function alive indefinitely as it would
    // complete before our backgroundTask has a chance
    // to execute if we didn't.
	select{}

}
```

좋습니다, 그래서 우리가 계속해서 이것을 실행하면, 백그라운드 태스크 고 루틴이 시작된 후에 `main ()` 함수가 
계속 실행되는 것을 볼 수 있습니다.

> **go run main.go**

```bash
Go Tickers Tutorial
The rest of my application can continue
Tock
Tock
Tock
^Csignal: interrupt
```

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

따라서 이 포스트에서는 고유한 Go 응용 프로그램 내에서 
티커를 기본 스레드와 백그라운드 작업으로 반복 가능한 작업 이전에 사용하는 방법을 살펴 보았습니다.

<h3 id="furtherReading">
  <a href="#furtherReading"></a>
  추가 자료
</h3>

이 함수를 음미하고 고급 컨텍스트에서 `ticker`를 사용하는 방법을 보려면 
실시간 YouTube 통계 모니터링 시스템인 다른 기사를 확인하는 것이 좋습니다.