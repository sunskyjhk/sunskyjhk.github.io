---
layout: post
title: "Go에서 네트워크 커맨드 라인 인터페이스 구축"
author: Sun
date: 2020-04-09 05:00:01
categories: [Go, Tutorial, Intermediate]
image: assets/images/golang.svg
featured: true
hidden: false
excerpt: "이 포스트에서는 Github(https://github.com/urfave/cli)에서 제공하는 
`urfave/cli` 패키지를 사용하여 Go에서 매우 간단한 커맨드라인 인터페이스를 작성합니다."
---

<div class="toc">
  <h4>Table Of Contents</h4>
  <nav id="TableOfContents">
    <ul>
      <li>
        <a href="#prerequisites">전제 조건</a>
      </li>
      <li>
        <a href="#popularProjects">인기있는 프로젝트</a>
      </li>
      <li>
        <a href="#videoTutorial">비디오 튜토리얼</a>
      </li>
      <li>
        <a href="#gettingStarted">시작하기</a>
      </li>
      <li>
        <a href="#gettingInto">코드로 들어가기</a>
      </li>
      <li>
        <a href="#ourFirst">우리의 첫 번째 명령</a>
      </li>
      <li>
        <a href="#lookingup">IP 주소 검색</a>
      </li>
      <li>
        <a href="#lookingupour">CNAME 검색</a>
      </li>
      <li>
        <a href="#lookingupMX">MX 레코드 조회</a>
      </li>
      <li>
        <a href="#buildingourCLI">CLI 구축</a>
      </li>
      <li>
        <a href="#conclusion">결론</a>
      </li>
    </ul>
  </nav>
</div>

이 포스트에서는 [Github](https://github.com/urfave/cli)에서 제공하는 
`urfave/cli` 패키지를 사용하여 Go에서 매우 간단한 커맨드라인 인터페이스를 작성합니다.

최근 다양한 호스팅 제공 업체에서 하나 또는 두 개의 도메인 마이그레이션을 해왔으며 
웹 사이트의 네임 서버, CNAME, IP 주소 및 웹 사이트와 같은 것을 쿼리하는데 사용할 수 있는 
도구나 프로그램을 구축하는 것을 생각해왔습니다.

이 튜토리얼의 전반적인 목표는 네트워크 모니터링, 이미지 조작 등과 같은 다양한 다른 작업을 
수행할 수 있는 고유 한 CLI를 구축할 수 있는 방법에 대한 아이디어를 제공하는 것입니다.

>**참고** - 이 포스트의 전체 코드는 
>[TutorialEdge/Go/go-cli-tutorial](https://github.com/TutorialEdge/Go/tree/master/go-cli-tutorial)에서 
>찾을 수 있습니다.

<h3 id="prerequisites">
  <a href="#prerequisites"></a>
  전제 조건
</h3>

* 개발 머신에 Go 버전 1.11 이상이 설치되어 있어야합니다.

<h3 id="popularProjects">
  <a href="#popularProjects"></a>
  인기있는 프로젝트 
</h3>

Golang은 엄청난 인기를 얻고 있으며 Hashicorp와 같은 대기업은 다양한 도구와 시스템에 언어를 채택하고 있습니다. 그리고 정당한 이유로 Go의 디자인은 
이러한 스타일의 응용 프로그램에 매우 적합하며 모든 주요 플랫폼에 대한 바이너리 실행 파일을 
쉽게 크로스 컴파일하는 기능은 큰 이점입니다.

<h3 id="videoTutorial">
  <a href="#videoTutorial"></a>
  비디오 튜토리얼 
</h3>

비디오 매체를 통한 학습을 선호하는 경우 여기에서이 튜토리얼을 확인하십시오.

[![video tutorial](https://img.youtube.com/vi/i2p0Snwk4gc/0.jpg)](https://youtu.be/i2p0Snwk4gc)

<h3 id="gettingStarted">
  <a href="#gettingStarted"></a>
  시작하기
</h3>

컴퓨터에 `go-cli/`라는 이름의 새 디렉토리를 만들겠습니다. 
프로젝트에 다음과 같은 디렉토리 구조를 만들 것입니다.

```bash
go-cli/
- pkg/
- cmd/my-cli/
- vendor/
- README.md
- ...
```

>**참고** - 이 구조는 Github에서 널리 사용되는 Go 프로젝트 레이아웃 가이드를 따릅니다.

<h3 id="gettingInto">
  <a href="#gettingInto"></a>
  코드로 들어가기
</h3>

기본 프로젝트 구조가 완성되었으므로 응용 프로그램 작업을 시작할 수 있습니다. 
우선 새 `cmd/my-cli/ ` 디렉토리에 `cli.go`라는 새 파일이 필요합니다. 
이를 간단한 `Hello World` 유형의 응용 프로그램으로 채우고 이를 기반으로 삼을 것입니다.

```go 
// cmd/my-cli/cli.go
package main

import (
  "fmt"
)

func main() {
  fmt.Println("Go CLI v0.01")
}
```

그런 다음 다음을 입력하여 프로젝트의 루트 디렉토리에서 이를 실행할 수 있습니다.

```bash
➜ go run cmd/my-cli/cli.go
Go CLI v0.01
```

훌륭합니다. 새로운 CLI를 만들었습니다. 
이제 몇 가지 명령을 추가하고 유용하게 사용할 수 있는 방법을 살펴 보겠습니다.

<h3 id="ourFirst">
  <a href="#ourFirst"></a>
  우리의 첫 번째 명령
</h3>

`urfave/cli` 패키지를 사용할 예정이므로 이 패키지를 사용하려면 로컬로이 패키지를 다운로드 해야합니다. 
간단한 `go get` 명령을 통해 다음과 같이 할 수 있습니다.

```bash
$ go get github.com/urfave/cli
```

필요한 패키지가 준비되었으므로 `cli.go` 파일을 업데이트하여 
이 패키지를 사용하고 새로운 CLI 응용 프로그램을 만들어 보겠습니다.

```go
// cmd/my-cli/cli.go
import (
  "log"
  "os"

  "github.com/urfave/cli"
)

func main() {
  err := cli.NewApp().Run(os.Args)
  if err != nil {
    log.Fatal(err)
  }
}
```

지금 실행하면 프로그램 응답을 구체화하고 버전, 
cli 사용법 및 다양한 명령을 추가할 수 있습니다.

```bash
➜  go run cmd/my-cli/cli.go
NAME:
   cli - A new cli application

USAGE:
   cli [global options] command [command options] [arguments...]

VERSION:
   0.0.0

COMMANDS:
     help, h  Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --help, -h     show help
   --version, -v  print the version
```

놀랍게도, 이것은 단지 부차적인 프로젝트가 아니라 보다 세련된 프로젝트처럼 보이기 시작했습니다.

이제 우리 자신의 `Command`를 추가 할 수 있습니다. 
이러한 각 명령은 테스트 중 하나와 일치하므로 하나의 명령이 있습니다. 
ns는 트리거되고 `url`과 함께 제공될 때 해당 호스트의 `Name` 서버를 검색하고 조회합니다.

마지막 명령 목록은 다음과 같습니다.

* `ns` - 이름 서버를 검색합니다
* `cname` - 주어진 호스트에 대한 CNAME을 조회합니다
* `mx` - 주어진 호스트에 대한 메일 교환 레코드를 조회합니다
* `ip` - 주어진 호스트의 IP 주소를 검색합니다.

훌륭하고 간단합니다. 첫 번째 명령을 만들어 시작하겠습니다.

```go 
package main

import (
    "fmt"
    "log"
    "net"
    "os"

    "github.com/urfave/cli"
)

func main() {
    app := cli.NewApp()
    app.Name = "Website Lookup CLI"
    app.Usage = "Let's you query IPs, CNAMEs, MX records and Name Servers!"

    // We'll be using the same flag for all our commands
    // so we'll define it up here
    myFlags := []cli.Flag{
        &cli.StringFlag{
            Name:  "host",
            Value: "tutorialedge.net",
        },
    }

    // we create our commands
    app.Commands = []*cli.Command{
        {
            Name:  "ns",
            Usage: "Looks Up the NameServers for a Particular Host",
            Flags: myFlags,
            // the action, or code that will be executed when
            // we execute our `ns` command
            Action: func(c *cli.Context) error {
                // a simple lookup function
                ns, err := net.LookupNS(c.String("host"))
                if err != nil {
                    return err
                }
                // we log the results to our console
                // using a trusty fmt.Println statement
                for i := 0; i < len(ns); i++ {
                    fmt.Println(ns[i].Host)
                }
                return nil
            },
        },
    }

    // start our application
    err := app.Run(os.Args)
    if err != nil {
        log.Fatal(err)
    }
}
```

그런 다음 다음을 입력하여 이를 실행할 수 있습니다.

```bash
$ go run cmd/my-cli/cli.go ns --host tutorialedge.net
```

그런 다음 내 사이트의 이름 서버를 반환하고 터미널에서 인쇄해야합니다. 
CLI 내에서 새 명령을 사용하는 방법을 정확하게 보여주는 help 명령을 실행할 수도 있습니다.

<h3 id="lookingup">
  <a href="#lookingup"></a>
  IP 주소 검색 
</h3>

결과를 인쇄하는 방법을 제외하고 모든 명령 정의는 프로그램 내에서 실제로 비슷하게 보입니다. 
`net.LookupIP()` 함수는 IP 주소 조각을 반환하므로 이를 좋은 방식으로 인쇄하려면 
이러한 주소를 반복해야합니다.

```go
{
    Name:  "ip",
    Usage: "Looks up the IP addresses for a particular host",
    Flags: myFlags,
    Action: func(c *cli.Context) error {
        ip, err := net.LookupIP(c.String("host"))
        if err != nil {
            fmt.Println(err)
        }
        for i := 0; i < len(ip); i++ {
            fmt.Println(ip[i])
        }
        return nil
    },
},
```

<h3 id="lookingupour">
  <a href="#lookingupour"></a>
  CNAME 검색 
</h3>

그런 다음 `cname` 명령을 추가하여 `net.LookupCNAME()` 함수를 전달된 호스트와 
함께 사용하고 단일 CNAME 문자열을 반환하면 인쇄할 수 있습니다.

```go 
{
    Name:  "cname",
    Usage: "Looks up the CNAME for a particular host",
    Flags: myFlags,
    Action: func(c *cli.Context) error {
        cname, err := net.LookupCNAME(c.String("host"))
        if err != nil {
            fmt.Println(err)
        }
        fmt.Println(cname)
        return nil
    },
},
```

<h3 id="lookingupMX">
  <a href="#lookingupMX"></a>
  MX 레코드 조회 
</h3>

마지막으로, 우리는 주어진 호스트에 대한 메일 교환 레코드를 쿼리 할 수 있기를 원합니다. 
`net.LookupMX()` 함수를 사용하여 호스트에 전달하면됩니다. 
그러면 IP와 같이 mx 레코드 조각이 반환됩니다. 
IP 레코드와 같이 인쇄하려면 다음과 같이 반복해야합니다.

```go 
{
    Name:  "mx",
    Usage: "Looks up the MX records for a particular host",
    Flags: myFlags,
    Action: func(c *cli.Context) error {
        mx, err := net.LookupMX(c.String("host"))
        if err != nil {
            fmt.Println(err)
        }
        for i := 0; i < len(mx); i++ {
            fmt.Println(mx[i].Host, mx[i].Pref)
        }
        return nil
    },
},
```

<h3 id="buildingourCLI">
  <a href="#buildingourCLI"></a>
  CLI 구축 
</h3>

이제 기본 CLI를 설치하고 실행 했으므로 이제 분노로 사용할 수 있도록 CLI를 빌드해야합니다.

```bash
$ go build cmd/my-cli/cli.go
```

다음과 같이 실행할 수있는 `cli` 실행 파일을 컴파일해야합니다.

```bash
$ ./cli help
NAME:
   Website Lookup CLI - Let's you query IPs, CNAMEs, MX records and Name Servers!

USAGE:
   cli [global options] command [command options] [arguments...]

VERSION:
   0.0.0

COMMANDS:
     ns       Looks Up the NameServers for a Particular Host
     cname    Looks up the CNAME for a particular host
     ip       Looks up the IP addresses for a particular host
     mx       Looks up the MX records for a particular host
     help, h  Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --help, -h     show help
   --version, -v  print the version
```

보시다시피, 모든 명령이 출력의 명령 섹션에 성공적으로 나열되었습니다.

<h3 id="conclusion">
  <a href="#conclusion"></a>
  결론 
</h3>

따라서 이 포스트에서는 Github의 `urface/cli` 패키지를 사용하여 매우 간단하면서도 효과적인 
CLI를 성공적으로 구축했습니다. 
CLI는 최소한의 번거 로움없이 모든 주요 운영 체제에 대해 크로스 컴파일 될 수 있으며 
프로덕션 급 커맨드라인 인터페이스에서 기대할 수 있는 모든 기능을 갖추고 있습니다.