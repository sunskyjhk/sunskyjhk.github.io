---
layout: post
title: "Go Modules 사용하기"
author: Sun
date: 2020-04-02 05:00:01
categories: [Go, Tutorial, Beginner]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Go 응용 프로그램에서 Go 모듈을 
사용하여 Go 응용 프로그램의 종속성에 대한 작업 방식을 
단순화하는 방법을 살펴 보겠습니다. 
Go Modules를 사용하는 간단한 Go 응용 프로그램을 개발하기 전에 
Go Modules의 작동 방식과 문제가 무엇인지 살펴 보겠습니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#goals">목표</a>
      </li>
      <li>
        <a href="#prerequisites">전제 조건</a>
      </li>
      <li>
        <a href="#whyGoModules">왜 모듈이 필요한가?</a>
      </li>
      <li>
        <a href="#theProblem">문제</a>
      </li>
      <li>
        <a href="#aSimpleExample">간단한 예</a>
      </li>
      <li>
        <a href="#addingDependenciesToYourProject">프로젝트에 의존성 추가하기</a>
      </li>
      <li>
        <a href="#handlingMajorandMinorVersions">메이저 및 마이너 버전 처리</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

이 포스트에서는 Go 응용 프로그램에서 Go 모듈을 사용하여 
Go 응용 프로그램의 종속성에 대한 작업 방식을 단순화하는 방법을 
살펴 보겠습니다. 

Go Modules를 사용하는 간단한 Go 응용 프로그램을 개발하기 전에 
Go Modules의 작동 방식과 문제가 무엇인지 살펴 보겠습니다.

<h3 id="goals">
  <a href="#goals"></a>
  목표
</h3>

이 포스팅의 목적:

* Go Modules에 대해 잘 알게 됩니다.
* Go Modules를 사용하는 Go 패키지를 빌드할 수 있게 됩니다.

<h3 id="prerequisites">
  <a href="#prerequisites"></a>
  전제 조건
</h3>

이 포스팅을 따라하기 위해서 다음이 있어야 합니다.

* 개발 머신에 Go 버전 1.11 이상이 설치되어 있어야합니다.
* GitHub에 계정이 필요합니다.

<h3 id="whyGoModules">
  <a href="#whyGoModules"></a>
  왜 모듈이 필요한가?
</h3>

지난 몇 년 동안 Go 언어의 종속성 관리 공간에서 많은 난기류가 발생했습니다. 
우리는 `dep`, `godep`, `govendor` 및 전체 heap과 같은 도구가 
이 문제를 한 번에 해결하려고 시도하는 장면에 더 많이 등장하는 것을 보았습니다.

Go 모듈은 향후 Go 애플리케이션 내에서 종속성을 처리하기 위한 솔루션의 공식적인 시도로 간주됩니다. 
이 작업의 주된 이유는 Go 개발자가 본질적으로 Go 패키지에 시맨틱 버전을 사용할 수 있게 하는 것이 었습니다.

시맨틱 버전 관리 (Semantic Versioning)는 시맨틱 버전 번호를 사용하여 
다양한 버전의 애플리케이션과 다양한 패키지 및 라이브러리에 레이블을 지정하는데 널리 사용됩니다. 
이 숫자는 v1.2.3과 같습니다. 
여기서 1은 응용 프로그램의 **major** 버전이고 2는 **minor** 버전이고 3은 **patch** 버전입니다.

* **Major Versions** - 특정 메이저 버전 내의 모든 버전은 다른 마이너 및 패치 버전과 호환됩니다. 
이 값을 늘리면 일반적으로 패키지를 사용하는 다른 개발자에게 패키지 작동 방식을 일부 **변경**했음을 알려줍니다.

* **Minor Versions** - 개발자는 응용 프로그램의 나머지 부분에서 이전 버전과의 호환성을 유지하면서 
새로운 기능이나 패키지에 새로운 기능을 추가할 때 패키지 또는 응용 프로그램의 **minor** 버전을 늘리는 경향이 있습니다.

* **Patch Versions** - 패치 버전은 일반적으로 일반적인 버그 수정에 사용됩니다. 
개발자가 응용 프로그램 내에서 약간의 문제나 버그를 발견하면 
이전 버전과의 호환성을 다시 확인하면서 문제를 해결한 다음 
패치 버전을 하나씩 증가시켜 새로운 버그 수정을 나타냅니다.

> **참고** - 버전이 지정된 Go 모듈에 대한 원래 제안은 여기에서 확인할 수 있습니다: 
>[Proposal: Version Go Modules](https://go.googlesource.com/proposal/+/master/design/24301-versioned-go.md)

<h3 id="theProblem">
  <a href="#theProblem"></a>
  문제
</h3>

패키지 A와 같은 여러 가지 주요 종속성이있는 Go 서비스를 개발한다고 가정 해보십시오. 
이제 서비스 패키지를 작성할 때 A 인터페이스에는 인터페이스가 설정되어 있으며 정해진 방식으로 작동합니다.

그러나 패키지 A의 관리자가 버그를 수정하거나 기능을 확장하기 위해 프로그램을 업데이트하면 어떻게됩니까? 
운이 좋으면 변경 사항이 응용 프로그램에 영향을 미치지 않을 수도 있지만 
운이 좋지 않을 수 있으며 이러한 변경 사항으로 인해 응용 프로그램이 중단될 수 있습니다.

이곳은 하루를 절약하기 위해 버전 관리가 시작되는 곳입니다. 
버전 관리를 사용하여 사용하려는 패키지 또는 라이브러리의 
정확한 버전을 선택하고 패키지를 작성할 때마다 항상 지정된 버전을 사용하도록 할 수 있습니다.

<h3 id="aSimpleExample">
  <a href="#aSimpleExample"></a>
  간단한 예
</h3>

포스팅의 이 부분에서는 Go 모듈을 사용하여 종속성을 처리하는 간단한 Go 패키지를 작성합니다.

`go-modules-test/`라는 응용 프로그램을 실행할 수 있는 새 프로젝트를 만들어 보겠습니다:

```bash
$ mkdir -p go-module-test
$ cd go-modules-test
```

다음으로이 모듈 내에서 프로젝트를 초기화하여 모듈을 사용하려고합니다. 
`go mod init` 명령을 사용하고 placeholder로 github repo 링크를 지정하여 이를 수행할 수 있습니다.

```bash
$ go mod init github.com/tutorialedge/go-modules-test
```

그러면 Go 응용 프로그램의 모든 종속성이 포함된 `go.mod` 파일이 생성됩니다.

이 작업을 완료하면 프로젝트 디렉토리 내에 `main.go`라는 새 파일을 작성하십시오.

> **go-modules-test/main.go**

```go 
package main

import "fmt"

func main() {
    fmt.Println("Hello World")
}
```

간단한 Go 애플리케이션을 실행하여 이 시점에서 모든 것이 작동하는지 확인합시다.

>**$ go run main.go**

```bash
Hello World
```

<h3 id="addingDependenciesToYourProject">
  <a href="#addingDependenciesToYourProject"></a>
  프로젝트에 의존성 추가하기
</h3>

이제 기본 프로젝트를 초기화하고 go 모듈을 사용했으므로 
이제 한 걸음 더 나아가 코드베이스에 새로운 종속성을 도입할 수 있는 방법을 살펴보겠습니다.

이 튜토리얼에서는 `"github.com/elliotforbes/test-package"`라는 사용자 정의 Go 패키지를 가져오며, 
Go 모듈을 통한 관리의 심화 연습을 통해보다 고급의 종속성에 익숙해질 수 있습니다.

`main.go` 파일의 맨 위에서 이 새 패키지를 가져 오십시오. 
가져온 후 해당 패키지 내에 선언된 함수 중 일부를 사용하는 방법을 살펴 보겠습니다.

> **go-modules-test/main.go**

```go
package main

import (
    "fmt"

    sample "github.com/elliotforbes/test-package"
)

func main() {
    fmt.Println("Hello World")
    sample.MySampleFunction()
}
```

프로그램 맨 위에있는 가져오기 목록에 해당 패키지를 추가 했으므로 
이제 아래처럼 일부를 사용해 볼 수 있습니다.

> **$ go run main.go**
```bash
go: finding github.com/elliotforbes/test-package v2.0.0
go: downloading github.com/elliotforbes/test-package v2.0.0
go: extracting github.com/elliotforbes/test-package v2.0.0
Hello World
Version 2.0 of this Function
Hello World
```

놀랍게도, Go 모듈을 사용하고 해당 Go 애플리케이션 내에서 
사용할 외부 종속성을 가져 오는 정말 간단한 Go 애플리케이션을 정의할 수 있었습니다!

<h3 id="handlingMajorandMinorVersions">
  <a href="#handlingMajorandMinorVersions"></a>
  메이저 및 마이너 버전 처리
</h3>

응용 프로그램이 `"github.com/elliotforbes/test-package"` 패키지를 가져올 때 최신 버전을 가져옵니다. 
가져올 버전을 세밀하게 제어하려면 go.mod 파일 내에서 필요한 정확한 버전을 정의할 수 있습니다.

>**go.mod**

```go 
module github.com/TutorialEdge/go-modules-tutorial

go 1.12

require github.com/elliotforbes/test-package v2.0.0
```

패키지의 v2.0.0에서 v1.0.0으로 버전을 수정한 후 다시 실행하면 다음이 표시됩니다.

>**$ go run main.go**
```bash
go: finding github.com/elliotforbes/test-package v1.0.0
go: downloading github.com/elliotforbes/test-package v1.0.0
go: extracting github.com/elliotforbes/test-package v1.0.0
Hello World
Version 1.0 of this Function
Hello World
```

프로덕션 환경에서 사용하려는 패키지의 정확한 버전을 성공적으로 정의할 수 있었습니다. 
이를 통해 우리가 릴리스 할 대상에 대해 더 큰 확신을 갖게되고, 
최종적으로 애플리케이션을 프로덕션 환경으로 푸시할 때 지식없이 
기본 패키지 변경으로 인해 치명적으로 중단되지 않습니다.

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론
</h3>

이 튜토리얼을 즐기시고 자신의 Go 애플리케이션에서 모듈을 
사용하는 방법에 대한 통찰력을 얻으셨기를 바랍니다.

