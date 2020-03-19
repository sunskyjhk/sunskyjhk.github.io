---
layout: post
title: "Go로 시작하기"
author: Sun
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "Go는 다양한 응용 프로그램을 구축할 수 있는 매우 놀라운 언어입니다. command-line 
인터페이스에서 분산형 마이크로시스템 및 클라우드 플랫폼에 이르기까지 이 언어가 가지는 단순성과 동시성을 
통해 많은 개발팀에서 강력하게 선택하게 되는 언어입니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#prerequisites">준비하기</a>
      </li>
      <li>
        <a href="#getting-started">시작하기</a>
      </li>
      <li>
        <a href="#conclusion">결</a>
      </li>
    </ul>
  </nav>
</div>

Go는 다양한 응용 프로그램을 구축할 수 있는 매우 놀라운 언어입니다. 
command-line 인터페이스에서 분산형 마이크로시스템 및 클라우드 플랫폼에 이르기까지 이 언어가 가지는 
단순성과 동시성을 통해 많은 개발팀에서 강력하게 선택하게 되는 언어입니다.

이번 포스팅을 통해서 언어를 익히고 실행하여 
더욱 뛰어난 응용 프로그램을 구축하고 기술을 발전시키는데 도움이 되길 바랍니다.

먼저 정말 간단한 `Hello World` 스타일 응용 프로그램을 시작하고 실행하는데 중점을 두겠습니다. 

모든 것을 순조롭게 마친다면 function, method, 그리고 concurrency 및 reflection과 
같은 언어의 보다 복잡한 측면을 배우는 과정을 시작할 수 있는 준비가 될 것 입니다.

<h3 id="prerequisites">
  <a href="#prerequisites"></a>
  준비하기
</h3>
  
이 포스트에 있는 내용을 수행하려면 Go가 필요합니다.
* 자신의 컴퓨터에 Go가 설치되어 있어야 합니다. 공식 다운로드 페이지를 통해 설치할 
수 있습니다: [Go 공식 다운로드 페이지](https://golang.org/dl/)

<h3 id="getting-started">
  <a href="#getting-started"></a>
  시작하기
</h3>

Go 언어와 관련된 모든 것을 설치하고 매우 간단한 프로그램을 작성해 봅시다.

먼저 현재 자신의 컴퓨터 OS에 따라 사용 가능한 다양한 버전의 Go를 설치할 수 있는 
[공식 시작하기 페이지](https://golang.org/doc/install)로 이동해 봅시다.

현재 시점에서 최신 버전을 설치해 봅시다. 이 포스트를 작성할 당시의 버전은 다음과 같습니다.

`go 1.14`

설치하고 나면 공식 Go 바이너리가 컴퓨터의 `PATH`에 추가됩니다. 
이 작업을 수행하면 여러분의 터미널에서 `go version`을 실행할 수 있게 됩니다:

```bash
$ go version
go version go1.14 darwin/amd64
```

이것이 제대로 작동하면 우리는 이제 Go 프로그램 작성을 시작할 수 있습니다.

선택한 코드 편집기를 열고 `Hello World` 프로젝트가 만들어질 새 디렉토리를 만들어 봅시다.

이 디렉토리 내에서 `main.go` 라는 새 파일을 만들어 봅시다. 우리는 이 파일에 비교적 간단한 
Go 프로그램을 만들어보겠습니다. 이 디렉토리 위치에서 터미널을 열고 다음 명령을 실행하려고 합니다.

```bash
$ GOMODULES11=ON 
$ go mode init github.com/hello/world
```

이를 통해 프로젝트를 초기화하고 향후 Go 코드를 하위 패키지로 분리할 수 있습니다. 
또한 최소한의 노력으로 원하는 외부 종속성을 검색할 수 있습니다.

이제 `main.go` 파일 내에 다음 코드를 추가해봅시다:

```go
// the first statement of every go source file
// must be a package declaration. If we aren't doing anything
// fancy, this tends to be package main.
package main

// We then want to use the fmt package
// which features a `print` function - Println
import "fmt"

// We then need to define our main function.
// Think of this as the entry point to our Go
// program
func main() {
    // within this main function, we then
    // want to call a function within the fmt
    // package called Println() in order to print
    // out `Hello World`
    fmt.Println("Hello World")
}
```

이게 끝입니다. 
이 5줄의 코드를 추가한 후에 `PATH`에 있는 `go` 바이너리를 사용하여 
이 코드를 실행하고 컴파일하도록 설정할 수 있습니다.

```bash
$ go run main.go
Hello World
```

이것을 바이너리 실행 파일로 컴파일하려면 `go` 바이너리를 다음과 같이 사용하면 됩니다.

```bash
$ go build main.go
$ ./main
```
> 축하합니다 - 첫 번째 Go 응용 프로그램을 성공적으로 작성, 실행 및 컴파일했습니다!

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이제 이 간단한 튜토리얼에서 Go개발 세계로의 여행을 성공적으로 시작했습니다.

Go 기술을 향상시키는데 관심이 있으시면 Go에서 사용할 수있는 기본 유형에 대해 이 튜토리얼의 다음 포스트를 확인하세요 - 
<a href="../Ch02-Go-Basic-Types-Tutorial/">Go 기본 타입 튜토리얼</a>   
