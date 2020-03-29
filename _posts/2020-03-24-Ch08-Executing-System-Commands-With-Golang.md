---
layout: post
title: "Go 프로그램으로 시스템 명령을 실행하기"
author: Sun
date: 2020-03-24 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이번 포스팅에서는 표준 라이브러리의 `os/exec` 패키지를 살펴보고 
Go 애플리케이션 내에서 시스템 명령을 성공적으로 실행하기 위해 이 패키지를 
어떻게 사용할 수 있는지 살펴 보겠습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#prerequisites">사전 준비</a>
      </li>
      <li>
        <a href="#crossCompatibilityIssues">상호 호환성 문제</a>
      </li>
      <li>
        <a href="#checkingCurrentOperatingSystem">현재 운영 체제 확인</a>
      </li>
      <li>
        <a href="#implementation">구현</a>
      </li>
      <li>
        <a href="#passinginArguments">인수 전달</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

번 포스팅에서는 표준 라이브러리의 `os/exec` 패키지를 살펴보고 
Go 애플리케이션 내에서 시스템 명령을 성공적으로 실행하기 위해 이 패키지를 
어떻게 사용할 수 있는지 살펴 보겠습니다.

> **참고** – 시스템 명령 실행에 대한 공식 문서 exec package는 
>[os/exec package](https://golang.org/pkg/os/exec/)에 있습니다.

<h3 id="prerequisites">
  <a href="#prerequisites"></a>
  사전 준비
</h3>

* 개발 머신에 Go 버전 1.11 이상이 설치되어 있어야합니다.

<h3 id="crossCompatibilityIssues">
  <a href="#crossCompatibilityIssues"></a>
  상호 호환성 문제 
</h3>

이 명령 중 일부는 운영 체제에서 작동하지 않을 수 있습니다. 
여러 플랫폼에서 호환되는 코드를 작성하려는 경우 모든 플랫폼에서 기능한는 명령을 선택하는 것이 좋습니다. 
이것이 불가능한 경우, 실행중인 시스템에 따라 다른 시스템 명령을 실행하는 조건부 논리를 프로그램에 추가하는 것이 좋습니다.

<h3 id="checkingCurrentOperatingSystem">
  <a href="#checkingCurrentOperatingSystem"></a>
  현재 운영 체제 확인
</h3>

코드가 실행중인 운영 체제를 확인하기 위해 런타임 패키지를 사용하고 GOOS 상수를 확인할 수 있습니다. 
운영 체제 타겟을 반환합니다.

```go
if runtime.GOOS == "windows" {
        fmt.Println("Can't Execute this on a windows machine")
    } else {
        execute()
    }
```

>**참고**-전체 GOOS 변수 목록은 [Sys Package](https://golang.org/pkg/runtime/internal/sys/#GOOS)에서 찾을 수 있습니다.

<h3 id="implementation">
  <a href="#implementation"></a>
  구현
</h3>

> **참고**-필자는 Windows 컴퓨터에서 작동하지 않을 수 있는 명령을 사용하여 MacOS에서 이 포스팅을 작성하고 있습니다.

`os/exec package`를 사용하여 `ls` 및 `pwd`와 같은 간단한 명령을 실행하는 방법을 살펴보고, 
기본 사항을 다룬 후에 고급 예제로 넘어갈 수 있습니다.

먼저 이 예제의 3가지 핵심 패키지인 `fmt`, `os/exec` 및 `runtime` package를 가져와야 합니다.

이 작업을 수행한 후 `execute()` 함수를 정의하여 실행해 보겠습니다.

```go
package main

import (
    "fmt"
    "os/exec"
    "runtime"
)

func execute() {

    // here we perform the pwd command.
    // we can store the output of this in our out variable
    // and catch any errors in err
    out, err := exec.Command("ls").Output()

    // if there is an error with our execution
    // handle it here
    if err != nil {
        fmt.Printf("%s", err)
    }
    // as the out variable defined above is of type []byte we need to convert
    // this to a string or else we will see garbage printed out in our console
    // this is how we convert it to a string
    fmt.Println("Command Successfully Executed")
    output := string(out[:])
    fmt.Println(output)

    // let's try the pwd command herer
    out, err = exec.Command("pwd").Output()
    if err != nil {
        fmt.Printf("%s", err)
    }
    fmt.Println("Command Successfully Executed")
    output = string(out[:])
    fmt.Println(output)
}

func main() {
    if runtime.GOOS == "windows" {
        fmt.Println("Can't Execute this on a windows machine")
    } else {
        execute()
    }
}
```

그런 다음 이를 실행하면 다음과 같이 표시됩니다.

```bash
$ go run main.go
Command Successfully Executed # ls command
main.go

Command Successfully Executed # pwd command
/Users/elliot/Documents/Projects/elliotforbes/...
```

보시다시피, 두 명령이 모두 성공적으로 실행되었으며 이러한 명령의 출력을 캡처한 후 
자체 Go 프로그램의 컨텍스트 내에서 출력할 수 있었습니다.

<h3 id="passinginArguments">
  <a href="#passinginArguments"></a>
  인수 전달
</h3>

굉장히 간단한 명령을 실행할 수 있었지만 이러한 명령에 인수를 전달하는 방법은 무엇입니까?

예를 들어 표준 `ls`와 달리 `ls -ltr`을 원한다고 가정해 보십시오.

고맙게도, 이것은 비교적 쉽습니다. 우리는 이러한 인수를 아래와 같이 `.Command()`에 추가하기만 하면 합니다.

```go
package main

import (
    "fmt"
    "os/exec"
    "runtime"
)

func execute() {
    out, err := exec.Command("ls", "-ltr").Output()
    if err != nil {
        fmt.Printf("%s", err)
    }
    fmt.Println("Command Successfully Executed")
    output := string(out[:])
    fmt.Println(output)
}

func main() {
    if runtime.GOOS == "windows" {
        fmt.Println("Can't Execute this on a windows machine")
    } else {
        execute()
    }
}
```

이것을 다시 실행하면 출력이 `-ltr` flag를 성공적으로 선택하는 것을 볼 수 있습니다.

```bash
$ go run main.go
Command Successfully Executed
total 8
-rw-r--r--  1 elliot  staff  988  6 Dec 17:52 main.go
```

>**참고**-`.Command()`는 여러 개의 후행 인수를 사용하는 `Variadic Function`의 예 이므로 
>원하는만큼 초기 명령에 여러 개의 인수를 전달할 수 있습니다.

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이 포스팅에서는 Go에서 `os/exec` package를 활용하여 Go 프로그램 내에서 
시스템 명령을 실행하는 방법을 살펴 보았습니다.
